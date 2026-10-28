"""
Export a freshness report for every ICB in the live D1 database.

Reads health boards and board policies from production D1 through the
Cloudflare REST API (read-only SELECT queries), then writes an Excel workbook
sorted by policy publication date, oldest first. The publication date is
health_boards.policy_date, the same value the site shows as "published on".
ICBs with no publication date sort to the top, since their age is unknown.
Rows whose policy is older than STALE_AFTER_DAYS, or undated, are highlighted.

Usage:
  python scripts/export-icb-policy-freshness.py

The API token is read from CLOUDFLARE_API_TOKEN in the environment, or from
.dev.vars at the project root if it is not set.

Requires:
  python -m pip install openpyxl==3.1.5 requests==2.34.2

Output is written to scripts/output/icb-policy-freshness-YYYY-MM-DD.xlsx
"""

import os
import sys
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

import requests
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

CLOUDFLARE_ACCOUNT_ID = "942566510de7d893dee1da18a2d8cd7b"
D1_DATABASE_ID = "0d01ebee-9961-4da7-a402-87ec678b48e8"  # "fertilityfund", see wrangler.toml
D1_QUERY_URL = (
    f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}"
    f"/d1/database/{D1_DATABASE_ID}/query"
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEV_VARS_PATH = PROJECT_ROOT / ".dev.vars"
OUTPUT_DIR = Path(__file__).resolve().parent / "output"
STALE_AFTER_DAYS = 180
REQUEST_TIMEOUT_SECONDS = 30
STALE_FILL = PatternFill("solid", start_color="FCE4D6", end_color="FCE4D6")

BOARDS_SQL = """
SELECT id, name, sub_board_code, parent_board_code, country, status,
       policy_date, last_verified
FROM health_boards
ORDER BY name
"""
POLICIES_SQL = """
SELECT board_id, updated_at, source_url
FROM board_policies
"""


@dataclass(frozen=True)
class ColumnSpec:
    header: str
    width: int
    number_format: str | None = None


COLUMNS: list[ColumnSpec] = [
    ColumnSpec("ICB name", 60),
    ColumnSpec("Board ID", 12),
    ColumnSpec("Sub-ICB code", 14),
    ColumnSpec("Parent ICB code", 16),
    ColumnSpec("Country", 14),
    ColumnSpec("Status", 10),
    ColumnSpec("Policies", 10),
    ColumnSpec("Policy published", 16, "yyyy-mm-dd"),
    ColumnSpec("Days since published", 18),
    ColumnSpec("Last verified", 16, "yyyy-mm-dd"),
    ColumnSpec("Policy last updated", 20, "yyyy-mm-dd hh:mm"),
    ColumnSpec("Policy source URL", 70),
]


@dataclass(frozen=True)
class IcbFreshnessRow:
    name: str
    board_id: str
    sub_icb_code: str | None
    parent_icb_code: str | None
    country: str | None
    status: str | None
    policy_count: int
    policy_published: date | None
    days_since_published: int | None
    last_verified: date | None
    policy_last_updated: datetime | None
    policy_source_urls: str

    @property
    def is_stale(self) -> bool:
        return self.policy_published is None or (
            self.days_since_published is not None
            and self.days_since_published > STALE_AFTER_DAYS
        )

    def as_cells(self) -> list[Any]:
        return [
            self.name,
            self.board_id,
            self.sub_icb_code,
            self.parent_icb_code,
            self.country,
            self.status,
            self.policy_count,
            self.policy_published,
            self.days_since_published,
            self.last_verified,
            self.policy_last_updated,
            self.policy_source_urls,
        ]


def parse_iso_date(value: str | None) -> date | None:
    return date.fromisoformat(value) if value else None


def parse_utc_datetime(value: str | None) -> datetime | None:
    """Parse an ISO timestamp from D1 and return naive UTC (Excel rejects tz-aware values)."""
    if not value:
        return None
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is not None:
        parsed = parsed.astimezone(timezone.utc).replace(tzinfo=None)
    return parsed


def build_row(board: dict[str, Any], policies: list[dict[str, Any]], today: date) -> IcbFreshnessRow:
    policy_published = parse_iso_date(board.get("policy_date"))
    last_verified = parse_iso_date(board.get("last_verified"))
    policy_timestamps = [parse_utc_datetime(p.get("updated_at")) for p in policies]
    latest_policy_update = max((ts for ts in policy_timestamps if ts), default=None)
    source_urls = sorted({p["source_url"] for p in policies if p.get("source_url")})

    return IcbFreshnessRow(
        name=board["name"],
        board_id=board["id"],
        sub_icb_code=board.get("sub_board_code"),
        parent_icb_code=board.get("parent_board_code"),
        country=board.get("country"),
        status=board.get("status"),
        policy_count=len(policies),
        policy_published=policy_published,
        days_since_published=(today - policy_published).days if policy_published else None,
        last_verified=last_verified,
        policy_last_updated=latest_policy_update,
        policy_source_urls=" | ".join(source_urls),
    )


def sort_key(row: IcbFreshnessRow) -> tuple[bool, bool, date, str]:
    # ICBs with policies first, then undated, then oldest published date, then name
    return (
        row.policy_count == 0,
        row.policy_published is not None,
        row.policy_published or date.min,
        row.name.lower(),
    )


def load_api_token() -> str | None:
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    if token:
        return token
    if not DEV_VARS_PATH.exists():
        return None
    for line in DEV_VARS_PATH.read_text().splitlines():
        key, _, value = line.partition("=")
        if key.strip() == "CLOUDFLARE_API_TOKEN":
            return value.strip().strip('"').strip("'")
    return None


def run_d1_query(session: requests.Session, sql: str) -> list[dict[str, Any]]:
    response = session.post(D1_QUERY_URL, json={"sql": sql}, timeout=REQUEST_TIMEOUT_SECONDS)
    response.raise_for_status()
    payload = response.json()
    if not payload.get("success"):
        raise RuntimeError(f"D1 query failed: {payload.get('errors')}")
    return payload["result"][0]["results"]


def fetch_boards(session: requests.Session) -> list[dict[str, Any]]:
    return run_d1_query(session, BOARDS_SQL)


def group_policies_by_board(session: requests.Session) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for policy in run_d1_query(session, POLICIES_SQL):
        grouped[policy["board_id"]].append(policy)
    return grouped


def write_workbook(rows: list[IcbFreshnessRow], output_path: Path) -> None:
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "ICB policy freshness"

    sheet.append([column.header for column in COLUMNS])
    for cell in sheet[1]:
        cell.font = Font(bold=True)
        cell.alignment = Alignment(wrap_text=True, vertical="center")

    for row in rows:
        sheet.append(row.as_cells())

    for index, column in enumerate(COLUMNS, start=1):
        sheet.column_dimensions[get_column_letter(index)].width = column.width

    for sheet_row, data_row in zip(sheet.iter_rows(min_row=2), rows, strict=True):
        for index, column in enumerate(COLUMNS):
            if column.number_format:
                sheet_row[index].number_format = column.number_format
        if data_row.is_stale and data_row.policy_count > 0:
            for cell in sheet_row:
                cell.fill = STALE_FILL

    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = sheet.dimensions
    workbook.save(output_path)


def main() -> int:
    token = load_api_token()
    if not token:
        print("CLOUDFLARE_API_TOKEN not found in the environment or .dev.vars.", file=sys.stderr)
        return 1

    today = date.today()

    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}", "Content-Type": "application/json"})

    boards = fetch_boards(session)
    policies_by_board = group_policies_by_board(session)
    print(f"Fetched {len(boards)} health board records from D1")

    rows = [build_row(board, policies_by_board.get(board["id"], []), today) for board in boards]
    rows.sort(key=sort_key)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"icb-policy-freshness-{today.isoformat()}.xlsx"
    write_workbook(rows, output_path)

    with_policies = [row for row in rows if row.policy_count > 0]
    stale_count = sum(1 for row in with_policies if row.is_stale)
    print(f"Wrote {len(rows)} rows to {output_path}")
    print(
        f"{stale_count} of {len(with_policies)} ICBs with policies were published more than "
        f"{STALE_AFTER_DAYS} days ago or have no publication date"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
