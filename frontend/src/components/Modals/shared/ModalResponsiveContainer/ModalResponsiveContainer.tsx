import React, {useEffect, useState} from 'react';
import {isMobile} from 'react-device-detect';

const ModalResponsiveContainer = (props: React.PropsWithChildren) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [initialHeight, setInitialHeight] = useState(window.innerHeight);
    const [height, setHeight] = useState(isMobile ? window.visualViewport.height : 100);

    useEffect(() => {
        if (isMobile) {
            const handleResize = () => {
                setHeight(window.visualViewport.height);
                if (window.visualViewport.height < initialHeight) {
                    setKeyboardVisible(true);
                } else {
                    setKeyboardVisible(false);
                }
            };
            window.visualViewport.addEventListener('resize', handleResize);
            return () => window.visualViewport.removeEventListener('resize', handleResize);
        }
        return () => {
        };
    }, []);

    useEffect(() => {
        setInitialHeight(window.innerHeight);
    }, [isMobile]);

    return (
        <div style={{
            position: 'relative',
            height: isMobile && keyboardVisible ? `calc(${height}px - 10dvh)` : '100%',
        }}>
            {props.children}
        </div>
    );
};

export {ModalResponsiveContainer};