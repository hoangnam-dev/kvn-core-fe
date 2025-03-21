'use client';

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/store/feats/Language/language.selectors";
import { Language } from "@/store/feats/Language/language.model";
import { setLanguage } from "@/store/feats/Language/language.action";
import { AppDispatch } from "@/store/redux";
import Image from "next/image";

const languages = [
    { code: "en", name: "English", flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/gb.svg" },
    { code: "vn", name: "Tiếng Việt", flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/vn.svg" },
    { code: "ja", name: "日本語", flag: "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/jp.svg" },
];

export const LanguageSelector: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentLanguage = useSelector(selectCurrentLanguage);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageSelect = (code: string) => {
        dispatch(setLanguage(code as Language["code"]));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Language selector button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white rounded-md shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
            >
                <div className="w-8 h-6 relative">
                    <Image
                        width={100}
                        height={100}
                        src={selectedLanguage.flag}
                        alt={selectedLanguage.name}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute w-[150px] mt-1 right-0 bg-white rounded-md shadow-lg z-10 border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                    <div className="grid grid-cols-1 gap-1 p-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                    currentLanguage === lang.code
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                }`}
                            >
                                <div className="w-4 h-3 relative mr-2">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={lang.flag}
                                        alt={lang.name}
                                        className="w-full h-full object-cover rounded-sm"
                                    />
                                </div>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;