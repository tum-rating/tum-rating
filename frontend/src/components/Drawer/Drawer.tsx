import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { DRAG_THRESHOLD, DRAWER_CLOSED_X, DRAWER_OPENED_X, DRAWER_WIDTH, SWIPEABLE_AREA } from './constans.ts';
import { getPointerCoordinates } from './utils.ts';

import {DRAWER_BACKDROP_Z_INDEX, DRAWER_Z_INDEX, HEADER_HEIGHT} from '@/constants';

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
            e.stopPropagation();
            setState((prevState) => ({
                ...prevState,
                swiping: false,
                count: prevState.count++
            }));
        }
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

    useEffect(() => {
        if (isMobile) {
            document.addEventListener('touchstart', onTouchStart);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        }
        return () => {
            if (isMobile) {
                document.removeEventListener('touchstart', onTouchStart);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            }
        };
    }, [document]);

    useEffect(() => {
        if (state.swiping) {
            setDrawerX(-state.alphaX - DRAWER_WIDTH);
        } else {
            if(state.count > 0){
                if(-state.alphaX >= startingPointRef.current){
                    isOpenRef.current = true;
                    setDrawerX(DRAWER_OPENED_X);
                    toggle(true);
                } else {
                    isOpenRef.current = false;
                    setDrawerX(DRAWER_CLOSED_X);
                    toggle(false);
                }
            }else{
                if(isOpenRef.current){
                    setDrawerX(DRAWER_OPENED_X);
                    toggle(true);
                }else{
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
                data-testid='drawer'
                style={{
                    willChange: 'transform',
                    transform: `translateX(${drawerX}px)`,
                    transition: `transform ${state.swiping ? '.1s' : '.4s'} cubic-bezier(0.25, 1, 0.5, 1)`,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    borderRight: '1px solid var(--app-shell-border-color)',
                    background: 'var(--mantine-color-body)',
                    width: DRAWER_WIDTH,
                    height: '100%',
                    zIndex: DRAWER_Z_INDEX
                }}
            >
                <div
                    data-testid="drawer-content"
                    className="content"
                    style={{
                        paddingTop: HEADER_HEIGHT,
                    }}
                >
                    {children}
                </div>
            </div>
            <div
                data-testid='drawer-backdrop'
                className="backdrop"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'invert(1)',
                    opacity: '.1',
                    background: 'var(--mantine-color-body)',
                    display: isOpenRef.current ? 'block' : 'none',
                    willChange: 'opacity, filter',
                    transition: 'opacity .4s, filter .4s',
                    zIndex: DRAWER_BACKDROP_Z_INDEX
                }}
                onClick={() => toggle()}
            ></div>
        </>
    );
};

export { Drawer };
