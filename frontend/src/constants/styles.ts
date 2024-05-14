import { isMobileOnly } from 'react-device-detect';

export const HEADER_HEIGHT = 54;
export const MAX_SITE_WIDTH = 1320;
export const CONTENT_TOP_SPACING = isMobileOnly ? 0 : 15;
