export interface GpPracticeSummary {
  odsCode: string;
  name: string;
  postcode?: string;
  orgLink?: string;
  isVirtual?: boolean;
}

/** Returned when the postcode is in a country with a national policy (Scotland, Wales, NI) */
export interface DirectBoardResolution {
  skipGp: true;
  country: string;
  boardId: string;
  boardName: string | null;
  slug: string | null;
  redirectUrl: string | null;
}

/** Metadata for a health board reflecting data confidence and enrichment columns */
export interface BoardMeta {
  data_confidence: 'confirmed' | 'inherited' | 'under_review' | 'unconfirmed';
  policy_date: string | null;
  last_verified: string | null;
  predecessor_icb: string | null;
  source_url: string | null;
  policy_pdf_r2_key: string | null;
  boroughs: string | null; // JSON array as TEXT
  summary_override: string | null; // Hand-written plain English summary (takes priority over template)
}

/** A news/update post stored in the updates table */
export interface UpdatePost {
  id: number;
  slug: string;
  title: string;
  published_date: string;
  summary: string;
  body: string;
  related_boards: string | null; // JSON array of board slugs
  tags: string | null; // JSON array
}
