import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { DRAG_THRESHOLD, DRAWER_CLOSED_X, DRAWER_OPENED_X, DRAWER_WIDTH, SWIPEABLE_AREA } from './constans.ts';
import { getPointerCoordinates } from './utils.ts';

import { HEADER_HEIGHT } from '@/constants';

export interface SwipeState {
    swiping: boolean;
    alphaX: number;
    count: number;
}

const initialState: SwipeState = { swiping: false, alphaX: DRAWER_CLOSED_X, count: 0 };

const isEqual = (prev: SwipeState, next: SwipeState): boolean => prev.swiping === next.swiping && prev.count === next.count && prev.alphaX === next.alphaX;

interface DrawerProps {
    open: boolean;
    children?: ReactNode;
    toggle: (flag?: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
    const { open, children, toggle } = props;
    const [state, setState] = useState(initialState);
    const [drawerX, setDrawerX] = useState(DRAWER_CLOSED_X);

    const startingPointRef = useRef<number>(-1);
    const swipeStartTimeRef = useRef<number>(0);
    const isDraggingRef = useRef(false);
    const isOpenRef = useRef(open);

    const startSwipe = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const clientX = getPointerCoordinates(e);
        if (!isOpenRef.current && clientX > SWIPEABLE_AREA) return;
        startingPointRef.current = clientX;
        swipeStartTimeRef.current = Date.now();
    };
    const continueSwipe = (e: MouseEvent | TouchEvent) => {
        const clientX = getPointerCoordinates(e);
        if (isDraggingRef.current || startingPointRef.current !== -1) {
            const alpha = isOpenRef.current ? state.alphaX + startingPointRef.current - clientX : startingPointRef.current - clientX;
            if (Math.abs(alpha) > DRAG_THRESHOLD) {
                isDraggingRef.current = true;
                const nextState: SwipeState = {
                    alphaX: alpha,
                    count: state.count,
                    swiping: true,
                };
                if (!isEqual(nextState, state)) {
                    setState(nextState);
                }
            }
        }
    };

    const endSwipe = (e: MouseEvent | TouchEvent) => {
        if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
            setState((prevState) => ({
                ...prevState,
                swiping: false,
                count: state.count + 1,
            }));
        }

        startingPointRef.current = -1;
        isDraggingRef.current = false;
    };

    const onTouchStart = useCallback(
        (e: TouchEvent) => {
            startSwipe(e);
        },
        [startSwipe],
    );

    const onTouchMove = useCallback(
        (e: TouchEvent) => {
            continueSwipe(e);
        },
        [continueSwipe],
    );

    const onTouchEnd = useCallback(
        (e: TouchEvent) => {
            endSwipe(e);
        },
        [endSwipe],
    );

    const onMouseDown = useCallback(
        (e: MouseEvent) => {
            startSwipe(e);
        },
        [startSwipe],
    );

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            continueSwipe(e);
        },
        [continueSwipe],
    );

    const onMouseUp = useCallback(
        (e: MouseEvent) => {
            endSwipe(e);
        },
        [endSwipe],
    );

    useEffect(() => {
        if (isMobile) {
            document.addEventListener('touchstart', onTouchStart);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        } else {
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            if (isMobile) {
                document.removeEventListener('touchstart', onTouchStart);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            } else {
                document.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        };
    }, [document]);

    useEffect(() => {
        if (state.swiping) {
            setDrawerX(-state.alphaX - DRAWER_WIDTH);
        } else {
            if (state.count > 0) {
                if (-state.alphaX >= (isOpenRef.current ? DRAWER_WIDTH * 0.9 : DRAWER_WIDTH * 0.1)) {
                    isOpenRef.current = true;
                    setDrawerX(DRAWER_OPENED_X);
                    toggle(true);
                } else {
                    isOpenRef.current = false;
                    setDrawerX(DRAWER_CLOSED_X);
                    toggle(false);
                }
            } else {
                if (isOpenRef.current) {
                    setDrawerX(DRAWER_OPENED_X);
                    toggle(true);
                } else {
                    setDrawerX(DRAWER_CLOSED_X);
                    toggle(false);
                }
            }
        }
    }, [state]);

    useEffect(() => {
        if (open === isOpenRef.current) return;
        isOpenRef.current = open;
        setDrawerX(open ? DRAWER_OPENED_X : DRAWER_CLOSED_X);
    }, [open]);

    return (
        <>
            <div
                style={{
                    willChange: 'transform',
                    transform: `translateX(${drawerX}px)`,
                    transition: `transform ${state.swiping ? '.1s' : '.4s'} cubic-bezier(0.25, 1, 0.5, 1)`,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    background: 'var(--mantine-color-body)',
                    width: DRAWER_WIDTH,
                    height: '100%',
                    zIndex: 1000,
                }}
            >
                <div>isOpen: {String(isOpenRef.current)}</div>
                <div
                    className="content"
                    style={{
                        paddingTop: HEADER_HEIGHT,
                    }}
                >
                    {children}
                </div>
            </div>
            <div
                className="backdrop"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'blur(5px)',
                    zIndex: 999,
                    display: isOpenRef.current ? 'block' : 'none',
                }}
                onClick={() => toggle()}
            ></div>
        </>
    );
};

export { Drawer };
