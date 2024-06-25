import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {isMobile} from "react-device-detect";

import {
    DRAG_THRESHOLD,
    SWIPEABLE_AREA,
    DRAWER_WIDTH
} from './constans.ts';
import {getPointerCoordinates} from './utils.ts';



export interface SwipeState {
    swiping: boolean
    alphaX: number
    count: number
}

const initialState: SwipeState = { swiping: false, alphaX: 0, count: 0 }

const isEqual = (prev: SwipeState, next: SwipeState): boolean => (
    prev.swiping === next.swiping &&
    prev.count === next.count &&
    prev.alphaX === next.alphaX
)


interface DrawerProps {
    open: boolean;
    children?: ReactNode;
    toggleFn?: () => void;
}

const Drawer = (props: DrawerProps) => {
    const {open, children, toggleFn} = props;
    const [state, setState] = useState(initialState)
    const [isOpen, setIsOpen] = useState(open);
    const [drawerX, setDrawerX] = useState(0)

    const startingPointRef = useRef<number>(-1)
    const isDraggingRef = useRef(false)


    const startSwipe = (e: MouseEvent | TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const clientX = getPointerCoordinates(e);
        if (!isOpen && clientX > SWIPEABLE_AREA) return;
        startingPointRef.current = clientX;
    }

    const continueSwipe = (e: MouseEvent | TouchEvent) => {
        const clientX = getPointerCoordinates(e)
        if (isDraggingRef.current || (startingPointRef.current !== -1)) {
            const alpha = startingPointRef.current - clientX

            if (Math.abs(alpha) > DRAG_THRESHOLD) {
                isDraggingRef.current = true

                const nextState: SwipeState = {
                    alphaX: alpha,
                    count: state.count,
                    swiping: true,
                }

                if (!isEqual(nextState, state)) {
                    setState(nextState)
                }
            }

        }
    }

    const endSwipe = (event: MouseEvent | TouchEvent) => {
        if (isDraggingRef.current) {
                event.preventDefault()
                event.stopPropagation()


            setState((prevState) => ({
                ...prevState,
                swiping: false,
                count: state.count + 1
            }))
        }

        startingPointRef.current = -1
        isDraggingRef.current = false
    }


    const onTouchStart = useCallback((e: TouchEvent) => {
        startSwipe(e);
    }, [startSwipe]);

    const onTouchMove = useCallback((e: TouchEvent) => {
        continueSwipe(e);
    }, [continueSwipe]);

    const onTouchEnd = useCallback((e: TouchEvent) => {
        endSwipe(e);
    }, [endSwipe]);

    const onMouseDown = useCallback((e: MouseEvent) => {
        startSwipe(e);
    }, [startSwipe]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        continueSwipe(e);
    }, [continueSwipe]);

    const onMouseUp = useCallback((e: MouseEvent) => {
        endSwipe(e);
    }, [endSwipe]);


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
        }
    }, [document]);

    useEffect(() => {
        console.log(state)
        setDrawerX(state.alphaX)
    }, [state]);

    return (
        <>
            <div style={{
                transform: `translateX(${-drawerX}px)`,
                position: 'fixed',
                top: 0,
                left: 0,
                background: "gray",
                width: DRAWER_WIDTH,
                height: '100%',
                zIndex: 1000,
            }}>
                <div className="content">
                    {children}
                </div>
            </div>

        </>
    );
};

export {Drawer};