import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom';

interface TooltipProps {
    text: string;
    position?: TooltipPosition;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, position = 'top', children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const childRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Đảm bảo component chỉ render bên phía client
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isVisible && childRef.current && tooltipRef.current) {
            const childRect = childRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top: number;
            let left = childRect.left + (childRect.width - tooltipRect.width) / 2;

            if (position === 'top') {
                top = childRect.top - tooltipRect.height - 8;
                // Nếu tooltip vượt quá phía trên cửa sổ, hiển thị ở dưới
                if (top < 0) {
                    top = childRect.bottom + 8;
                }
            } else {
                top = childRect.bottom + 8;
                // Nếu tooltip vượt quá phía dưới cửa sổ, hiển thị ở trên
                if (top + tooltipRect.height > window.innerHeight) {
                    top = childRect.top - tooltipRect.height - 8;
                }
            }

            // Đảm bảo tooltip không vượt quá bên trái cửa sổ
            if (left < 0) {
                left = 0;
            }
            // Đảm bảo tooltip không vượt quá bên phải cửa sổ
            else if (left + tooltipRect.width > window.innerWidth) {
                left = window.innerWidth - tooltipRect.width;
            }

            setTooltipStyle({
                top: `${top}px`,
                left: `${left}px`,
            });
        }
    }, [isVisible, position]);

    const tooltipElement = (
        <div
            ref={tooltipRef}
            className="fixed z-[9999] px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg"
            style={tooltipStyle}
        >
            {text}
        </div>
    );

    return (
        <>
            <div
                ref={childRef}
                className="inline-block"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {mounted && isVisible && createPortal(tooltipElement, document.body)}
        </>
    );
};

export default Tooltip;