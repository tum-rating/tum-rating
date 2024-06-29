import { isMobile } from 'react-device-detect';

const DRAWER_WIDTH = isMobile ? window.innerWidth : 320;
const DRAG_THRESHOLD = 20;
// const FAST_SWIPE_THRESHOLD = 150;
const SWIPEABLE_AREA = isMobile ? DRAWER_WIDTH / 4 : 250;

const DRAWER_CLOSED_X = -DRAWER_WIDTH;
const DRAWER_OPENED_X = 0;

export {
    DRAG_THRESHOLD,
    SWIPEABLE_AREA,
    DRAWER_WIDTH,
    DRAWER_CLOSED_X,
    DRAWER_OPENED_X,
    // FAST_SWIPE_THRESHOLD
};
