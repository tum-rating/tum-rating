import { CLOSED_DRAWER_X, OPENED_DRAWER_X } from '@/components/Drawer/constans.ts';

interface DrawerAnimationProps {
    x: number;
}

const openedDrawerAnimation = ({ x }: DrawerAnimationProps) => {
    const bounceLevels = {
        '3': OPENED_DRAWER_X + 68,
        '2': OPENED_DRAWER_X + 28,
        '1': OPENED_DRAWER_X + 8,
        '0': OPENED_DRAWER_X,
    };
    return {
        '0%': {
            transform: `translateX(${x}px)`,
        },
        '100%': {
            transform: `translateX(${OPENED_DRAWER_X}px)`,
        },
        // '0%': {
        //     transform: `translateX(${x}px)`,
        //     'animation-timing-function': ' ease-in',
        // },
        // '38%': {
        //     transform: `translateX(${OPENED_DRAWER_X}px)`,
        //     'animation-timing-function': ' ease-out',
        // },
        // '55%': {
        //     transform: `translateX(${bounceLevels['3']})`,
        //     'animation-timing-function': ' ease-in',
        // },
        // '72%': {
        //     transform: 'translateX(0)',
        //     'animation-timing-function': ' ease-out',
        // },
        // '81%': {
        //     transform: `translateX(${bounceLevels['2']})`,
        //     'animation-timing-function': ' ease-in',
        // },
        // '90%': {
        //     transform: 'translateX(0)',
        //     'animation-timing-function': ' ease-out',
        // },
        // '95%': {
        //     transform: `translateX(${bounceLevels['1']}`,
        //     'animation-timing-function': ' ease-in',
        // },
        // '100%': {
        //     transform: `translateX(${bounceLevels['0']}`,
        //     'animation-timing-function': ' ease-out',
        // },
    };
};

const closedDrawerAnimation = ({ x }: DrawerAnimationProps) => {
    return {
        '0%': {
            transform: `translateX(${x}px)`,
        },
        '100%': {
            transform: `translateX(${CLOSED_DRAWER_X}px)`,
        },
    };
};

export { openedDrawerAnimation, closedDrawerAnimation };
