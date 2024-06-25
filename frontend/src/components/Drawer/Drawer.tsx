import { ReactNode, useEffect, useState } from 'react';

import { CLOSED_DRAWER_ANIMATION_NAME, CLOSED_DRAWER_X, DRAWER_CONTENT_WIDTH, DRAWER_LEFT_OVERFLOW_WIDTH, DRAWER_WIDTH, OPENED_DRAWER_ANIMATION_NAME, OPENED_DRAWER_X } from './constans.ts';
import { closedDrawerAnimation, openedDrawerAnimation } from './utils.ts';

import { Keyframe } from '@/components/Keyframe';

interface DrawerProps {
    open: boolean;
    children?: ReactNode;
    toggleFn?: () => void;
}

const Drawer = (props: DrawerProps) => {
    const { open, children } = props;
    const [isOpen, setIsOpen] = useState(open);

    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);

    const [drawerStartX, setDrawerStartX] = useState(CLOSED_DRAWER_X);

    const [drawerX, setDrawerX] = useState(CLOSED_DRAWER_X);
    const [drag, setDrag] = useState(false);

    const onTouchStart = (e: TouchEvent) => {
        if (!isOpen) {
            if (drawerX <= e.touches[0].clientX && e.touches[0].clientX <= 10 && !drag) {
                setStartX(e.touches[0].clientX);
                setEndX(e.touches[0].clientX);
                setDrawerStartX(drawerStartX + (e.touches[0].clientX - startX));
                setDrag(true);
            }
        } else {
            if(drag){
                if (e.touches[0].clientX <= DRAWER_CONTENT_WIDTH) {
                    setStartX(e.touches[0].clientX);
                    setEndX(e.touches[0].clientX);
                    setDrawerStartX(drawerStartX + (e.touches[0].clientX - startX));
                }
            }
        }
    };

    const onTouchMove = (e: TouchEvent) => {
            if(drag){
                if (e.touches[0].clientX >= DRAWER_WIDTH) {
                } else {
                    const x = drawerStartX + (e.touches[0].clientX - startX);
                    setDrawerX(x);
                }
            }
    };

    const onTouchEnd = (e: TouchEvent) => {
        if (drag) {
            setDrag(false);

            if (e.changedTouches[0].clientX >= DRAWER_CONTENT_WIDTH / 2) {
                setDrawerX(OPENED_DRAWER_X);
                if (e.changedTouches[0].clientX >= DRAWER_WIDTH) {
                    setEndX(DRAWER_CONTENT_WIDTH);
                } else {
                    setEndX(drawerStartX + (e.changedTouches[0].clientX - startX));
                }
                setIsOpen(true);
            } else {
                setDrawerX(CLOSED_DRAWER_X);
                setEndX(drawerStartX + (e.changedTouches[0].clientX - startX));
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchstart', onTouchStart);

        return () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.addEventListener('touchstart', onTouchStart);
        };
    }, [drag, startX, drawerStartX]);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return (
        <>
            {!drag && <Keyframe name={isOpen ? OPENED_DRAWER_ANIMATION_NAME : CLOSED_DRAWER_ANIMATION_NAME} animationProps={isOpen ? openedDrawerAnimation({ x: endX }) : closedDrawerAnimation({ x: endX })} />}
            <div
                style={{
                    transform: `${drag ? `translateX(${drawerX}px)` : 'none'}`,
                    animation: `${!drag ? (isOpen ? OPENED_DRAWER_ANIMATION_NAME : CLOSED_DRAWER_ANIMATION_NAME) : ''} .4s both`,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: DRAWER_WIDTH + 'px',
                    background: 'orange',
                    zIndex: 9999,
                    display: 'flex',
                }}
            >
                <div style={{ width: `${DRAWER_LEFT_OVERFLOW_WIDTH}px`, background: 'red' }}></div>
                <div
                    style={{
                        width: `${DRAWER_CONTENT_WIDTH}px`,
                        background: `green`,
                    }}
                >
                    <div style={{ width: '200px', background: 'gray' }}>
                        <button onClick={toggleDrawer}>Toggle Drawer</button>
                        {children}
                    </div>
                </div>
            </div>
            <div
                className="backdrop"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 9998,
                    display: drag || isOpen ? 'block' : 'none',
                }}
            ></div>
        </>
    );
};

export { Drawer };