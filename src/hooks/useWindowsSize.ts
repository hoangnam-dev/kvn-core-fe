import { useState, useEffect } from 'react';

// Định nghĩa interface cho kích thước cửa sổ
interface WindowSize {
    width: number;
    height: number;
}

function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize(): void {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        if (typeof window !== 'undefined') {
            handleResize();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }

        return () => {};
    }, []);

    return windowSize;
}

export default useWindowSize;