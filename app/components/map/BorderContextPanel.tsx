import { Link } from 'react-router';
import { toSlug } from '../../lib/slug';
import { STATUS_BADGE } from '@/utils/theme';

export interface BorderContextPanelProps {
  currentBoard: { id: string; name: string; cyclesOffered: number | null };
  neighbours: Array<{ id: string; name: string; cyclesOffered: number | null; slug: string | null }>;
  loading: boolean;
}

/**
 * Determines whether a neighbouring board offers more cycles than the current board.
 * Returns true if neighbourCycles is non-null AND neighbourCycles > (currentCycles ?? 0).
 */
function isImprovement(currentCycles: number | null, neighbourCycles: number | null): boolean {
  if (neighbourCycles === null) return false;
  return neighbourCycles > (currentCycles ?? 0);
}

/**
 * Determines whether a neighbouring board offers fewer cycles than the current board.
 * Returns true if neighbourCycles is non-null AND neighbourCycles < (currentCycles ?? 0).
 */
function isWorse(currentCycles: number | null, neighbourCycles: number | null): boolean {
  if (neighbourCycles === null) return false;
  return neighbourCycles < (currentCycles ?? 0);
}

function formatCycles(cycles: number | null): string {
  if (cycles === null) return 'No data';
  if (cycles === 0) return '0 cycles';
  if (cycles === 1) return '1 cycle';
  return `${cycles} cycles`;
}

/**
 * BorderContextPanel displays a comparison between the user's current health board
 * and visible neighbouring boards, highlighting any that offer more IVF cycles.
 */
export function BorderContextPanel({ currentBoard, neighbours, loading }: BorderContextPanelProps) {
  if (loading) {
    return (
      <div
        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tint/20"
        role="region"
        aria-label="Neighbouring board comparison"
      >
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-3/4 rounded bg-surface" />
          <div className="h-3 w-1/2 rounded bg-surface" />
          <div className="h-3 w-2/3 rounded bg-surface" />
        </div>
      </div>
    );
  }

  const hasImprovement = neighbours.some((n) => isImprovement(currentBoard.cyclesOffered, n.cyclesOffered));

  return (
    <div
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tint/20"
      role="region"
      aria-label="Neighbouring board comparison"
    >
      {/* Current board */}
      <div className="mb-3">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink/55">
          Your board
        </h4>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-sans text-sm font-medium text-ink">{currentBoard.name}</span>
          <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink">
            {formatCycles(currentBoard.cyclesOffered)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-tint/15" />

      {/* Neighbours */}
      <div className="mt-3">
        <h4 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink/55">
          Neighbouring boards
        </h4>

        {neighbours.length === 0 ? (
          <p className="mt-2 font-sans text-xs text-ink/55">No neighbouring boards visible</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {neighbours.map((neighbour) => {
              const improved = isImprovement(currentBoard.cyclesOffered, neighbour.cyclesOffered);
              const worse = isWorse(currentBoard.cyclesOffered, neighbour.cyclesOffered);
              return (
                <li key={neighbour.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {neighbour.slug ? (
                      <Link
                        to={`/board/${toSlug(neighbour.slug)}`}
                        className="font-sans text-sm font-medium text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint"
                      >
                        {neighbour.name}
                      </Link>
                    ) : (
                      <span className="font-sans text-sm font-medium text-ink">{neighbour.name}</span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      improved
                        ? STATUS_BADGE.improved
                        : worse
                          ? STATUS_BADGE.worse
                          : STATUS_BADGE.neutral
                    }`}
                  >
                    {improved && (
                      <span className="mr-0.5" aria-hidden="true">↑</span>
                    )}
                    {worse && (
                      <span className="mr-0.5" aria-hidden="true">↓</span>
                    )}
                    {formatCycles(neighbour.cyclesOffered)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Summary message when no neighbour offers more */}
        {neighbours.length > 0 && !hasImprovement && (
          <p className="mt-3 font-sans text-xs text-ink/55">
            Your board matches or exceeds neighbouring provision
          </p>
        )}
      </div>
    </div>
  );
}
