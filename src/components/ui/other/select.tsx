import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
    value: string | number;
    label?: string;
}

interface SelectProps {
    options: SelectOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    className?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    // Lấy option hiện tại
    const selectedOption = options.find(option => option.value === value);
    const displayValue = selectedOption?.label || selectedOption?.value || '';

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleOptionClick = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // Cập nhật vị trí dropdown khi mở
    useEffect(() => {
        if (isOpen && selectRef.current && dropdownRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current.offsetHeight;
            const windowHeight = window.innerHeight;
            const maxHeight = windowHeight - 10; // Cách mép dưới 10px

            setDropdownStyle({
                position: 'fixed',
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                top: `${Math.min(rect.bottom, maxHeight - dropdownHeight)}px`,
                maxHeight: `${maxHeight}px`,
                overflowY: 'auto',
            });
        }
    }, [isOpen]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectRef.current && !selectRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative inline-block ${className}`} ref={selectRef}>
            <button
                type="button"
                className="flex items-center justify-between w-20 px-3 py-2 text-sm bg-whiteshadow-sm hover:bg-gray-50 focus:outline-none "
                onClick={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="block truncate">{displayValue}</span>
                <svg
                    className={`w-5 h-5 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown list */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="bg-white border border-gray-300 rounded-md shadow-lg"
                    style={dropdownStyle}
                >
                    <ul className="py-1 overflow-auto text-sm" role="listbox">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100 ${
                                    option.value === value ? 'bg-gray-100' : ''
                                }`}
                                role="option"
                                onClick={() => handleOptionClick(option.value)}
                            >
                                <span className="block truncate">{option.label || option.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Select;
