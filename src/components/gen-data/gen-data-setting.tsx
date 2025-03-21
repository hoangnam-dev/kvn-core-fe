'use client';

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {GridColPin, GridColShow, GridOptions, GridReset, Setting} from "@/icons";
import TextCellSetting from "@/common/messages/cellSetting.json";
import {translate} from "@/common/utils.translator";
import {useSelector} from "react-redux";
import {selectCurrentLanguage} from "@/store/feats/Language/language.selectors";

interface TableSettingsActionProps {
    toggleLayout?: () => void;
}

export const TableSettingsAction: React.FC<TableSettingsActionProps> = ({ toggleLayout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLSpanElement>(null);
    const dropdownWidth = 250;

    const currentLanguage = useSelector(selectCurrentLanguage);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            let leftPosition = rect.right - dropdownWidth; // Đẩy dropdown sang trái
            const topPosition = rect.bottom + window.scrollY;

            if (leftPosition < 0) {
                leftPosition = 0;
            }

            setDropdownPosition({ top: topPosition, left: leftPosition });
        }
    }, [isOpen]);

    return (
        <>
            <span ref={buttonRef}
              onClick={(event) => {
                  event.stopPropagation();
                  setIsOpen((prev) => !prev);
              }}
              className={`${!isOpen ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                <Setting/>
            </span>


            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "absolute",
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownWidth,
                        }}
                        className="h-fix bg-white rounded-md shadow-lg z-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
                    >
                        <div className="grid grid-cols-1 gap-1 p-1">
                            <button
                                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                                onClick={() => {
                                    if(toggleLayout){
                                        toggleLayout()
                                    }
                                    setIsOpen(false);
                                }}
                            >
                                <GridOptions width={22} height={22} />
                                <span className="ml-3 text-sm">
                                    {translate(TextCellSetting.add_display_option, currentLanguage)}
                                </span>
                            </button>
                            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                                <GridReset width={22} height={22}/>
                                <span className="ml-3 text-sm">
                                    {translate(TextCellSetting.reset_default, currentLanguage)}
                                </span>
                            </button>
                            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                                <GridColShow width={22} height={22}/>
                                <span className="ml-3 text-sm">
                                    {translate(TextCellSetting.column_display_option, currentLanguage)}
                                </span>
                            </button>
                            <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                                <GridColPin width={24} height={24}/>
                                <span className="ml-3 text-sm">
                                    {translate(TextCellSetting.column_lock_option, currentLanguage)}
                                </span>
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default TableSettingsAction;
