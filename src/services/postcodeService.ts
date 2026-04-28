export { PostcodeLookupError } from './postcodeService/errors';
export type { PostcodeLookupErrorKind } from './postcodeService/errors';
export { searchGpPracticesByName, searchGpPracticesByPostcode } from './postcodeService/gpPractices';
export { getIcbFromGpPractice } from './postcodeService/gpIcb';
export { lookupICBPoliciesByIcbCode } from './postcodeService/icbPolicy';
export { fetchIcbDocuments, getDocumentDownloadUrl } from './postcodeService/icbDocuments';
export type { IcbDocumentFile, IcbDocumentYear, IcbDocumentsResponse } from './postcodeService/icbDocuments';
