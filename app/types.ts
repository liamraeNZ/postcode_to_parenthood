export interface GpPracticeSummary {
  odsCode: string;
  name: string;
  postcode?: string;
  orgLink?: string;
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
