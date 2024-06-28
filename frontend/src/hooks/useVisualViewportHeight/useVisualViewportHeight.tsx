import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

const useVisualViewportHeight = () => {
    const [height, setHeight] = useState(isMobile ? window.visualViewport.height : '100%');

    useEffect(() => {
        if (isMobile) {
            const handleResize = () => setHeight(window.visualViewport.height);
            window.visualViewport.addEventListener('resize', handleResize);
            return () => window.visualViewport.removeEventListener('resize', handleResize);
        }
        return () => {};
    }, []);

    return height;
};

export { useVisualViewportHeight };
