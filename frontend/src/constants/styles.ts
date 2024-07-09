import { getDefaultZIndex } from '@mantine/core';
import { isMobileOnly } from 'react-device-detect';

const modalZIndex = getDefaultZIndex('modal');

export const HEADER_HEIGHT = 54;
export const MAX_SITE_WIDTH = 1320;
export const CONTENT_TOP_SPACING = isMobileOnly ? 0 : 15;

export const HEADER_Z_INDEX = modalZIndex + 1;
export const DRAWER_Z_INDEX = modalZIndex - 2;
export const DRAWER_BACKDROP_Z_INDEX = modalZIndex - 3;
