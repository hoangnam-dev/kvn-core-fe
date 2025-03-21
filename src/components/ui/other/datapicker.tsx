// components/CustomDatepicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/common/style/CustomDatepicker.module.css';
import {useSelector} from "react-redux";
import {selectCurrentLanguage} from "@/store/feats/Language/language.selectors";

// Define language types
export type LanguageType = 'en' | 'vn' | 'ja';

// Interface for localization data
interface LocaleData {
    monthNames: string[];
    dayNames: string[];
    today: string;
    clear: string;
    cancel: string;
    select: string;
    placeholder: string;
    dateFormat: string;
}

// Localization data for each language
const locales: Record<LanguageType, LocaleData> = {
    en: {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        today: 'Today',
        clear: 'Clear',
        cancel: 'Cancel',
        select: 'Select',
        placeholder: 'MM/DD/YYYY',
        dateFormat: 'MM/DD/YYYY'
    },
    vn: {
        monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        dayNames: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        today: 'Hôm nay',
        clear: 'Xóa',
        cancel: 'Hủy',
        select: 'Chọn',
        placeholder: 'DD/MM/YYYY',
        dateFormat: 'DD/MM/YYYY'
    },
    ja: {
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        dayNames: ['日', '月', '火', '水', '木', '金', '土'],
        today: '今日',
        clear: 'クリア',
        cancel: 'キャンセル',
        select: '選択',
        placeholder: 'YYYY/MM/DD',
        dateFormat: 'YYYY/MM/DD'
    }
};

interface DatepickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    label?: string;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

const CustomDatepicker: React.FC<DatepickerProps> = ({
                                                         value,
                                                         onChange,
                                                         label,
                                                         minDate,
                                                         maxDate,
                                                         disabled = false,
                                                         required = false,
                                                         className = '',
                                                     }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const calendarRef = useRef<HTMLDivElement>(null);

    const currentLang = useSelector(selectCurrentLanguage)

    const locale = locales[currentLang];

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update displayed date when value changes externally
    useEffect(() => {
        setSelectedDate(value);
        if (value) {
            setCurrentMonth(value);
            setInputValue(formatDate(value));
        } else {
            setInputValue('');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, currentLang]);

    // Format date based on locale
    const formatDate = (date: Date): string => {
        if (!date) return '';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        switch (currentLang) {
            case 'en':
                return `${month}/${day}/${year}`;
            case 'vn':
                return `${day}/${month}/${year}`;
            case 'ja':
                return `${year}/${month}/${day}`;
            default:
                return `${month}/${day}/${year}`;
        }
    };

    // Parse date string based on locale
    const parseDate = (dateString: string): Date | null => {
        if (!dateString) return null;

        let day: number, month: number, year: number;

        try {
            const parts = dateString.split(/[-\/.]/);
            if (parts.length !== 3) return null;

            switch (currentLang) {
                case 'en': // MM/DD/YYYY
                    month = parseInt(parts[0], 10) - 1;
                    day = parseInt(parts[1], 10);
                    year = parseInt(parts[2], 10);
                    break;
                case 'vn': // DD/MM/YYYY
                    day = parseInt(parts[0], 10);
                    month = parseInt(parts[1], 10) - 1;
                    year = parseInt(parts[2], 10);
                    break;
                case 'ja': // YYYY/MM/DD
                    year = parseInt(parts[0], 10);
                    month = parseInt(parts[1], 10) - 1;
                    day = parseInt(parts[2], 10);
                    break;
                default:
                    return null;
            }

            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            if (month < 0 || month > 11 || day < 1 || day > 31) return null;

            const date = new Date(year, month, day);
            if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
                return null; // Invalid date (e.g., Feb 31)
            }

            return date;
        } catch {
            return null;
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value === '') {
            setSelectedDate(null);
            onChange(null);
            return;
        }

        const parsedDate = parseDate(value);
        if (parsedDate) {
            setSelectedDate(parsedDate);
            setCurrentMonth(parsedDate);
            onChange(parsedDate);
        }
    };

    // Handle day selection
    const handleSelectDate = (date: Date) => {
        setSelectedDate(date);
        setInputValue(formatDate(date));
        onChange(date);
        setIsOpen(false);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();

        // Calculate days from previous month
        const prevMonthDays = [];
        if (firstDayOfWeek > 0) {
            const prevMonth = new Date(year, month, 0);
            const prevMonthLastDay = prevMonth.getDate();

            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                const date = new Date(year, month - 1, day);
                prevMonthDays.push({
                    date,
                    day,
                    currentMonth: false,
                    isToday: isSameDay(date, new Date()),
                    isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
                    isDisabled: isDateDisabled(date)
                });
            }
        }

        // Current month days
        const currentMonthDays = [];
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            currentMonthDays.push({
                date,
                day,
                currentMonth: true,
                isToday: isSameDay(date, new Date()),
                isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
                isDisabled: isDateDisabled(date)
            });
        }

        // Next month days to fill the calendar grid
        const nextMonthDays = [];
        const daysNeeded = 42 - (prevMonthDays.length + currentMonthDays.length);
        for (let day = 1; day <= daysNeeded; day++) {
            const date = new Date(year, month + 1, day);
            nextMonthDays.push({
                date,
                day,
                currentMonth: false,
                isToday: isSameDay(date, new Date()),
                isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
                isDisabled: isDateDisabled(date)
            });
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    // Check if two dates are the same day
    const isSameDay = (date1: Date, date2: Date) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    // Check if a date is disabled
    const isDateDisabled = (date: Date) => {
        if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
        return !!(maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999)));
    };

    // Navigate to previous month
    const goToPrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Go to today
    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        if (!isDateDisabled(today)) {
            setSelectedDate(today);
            setInputValue(formatDate(today));
            onChange(today);
        }
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedDate(null);
        setInputValue('');
        onChange(null);
        setIsOpen(false);
    };

    // Calendar days
    const calendarDays = generateCalendarDays();

    return (
        <div className={`${styles.datepickerContainer} ${className}`}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={() => !disabled && setIsOpen(true)}
                    placeholder={locale.placeholder}
                    disabled={disabled}
                    className={styles.input}
                />
                <button
                    type="button"
                    className={styles.calendarButton}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    {/* Calendar icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {isOpen && !disabled && (
                <div className={styles.calendarContainer} ref={calendarRef}>
                    <div className={styles.calendarHeader}>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={goToPrevMonth}
                        >
                            &lt;
                        </button>
                        <div className={styles.monthYearLabel}>
                            {locale.monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </div>
                        <button
                            type="button"
                            className={styles.navButton}
                            onClick={goToNextMonth}
                        >
                            &gt;
                        </button>
                    </div>

                    <div className={styles.weekdaysContainer}>
                        {locale.dayNames.map((day, index) => (
                            <div key={index} className={styles.weekday}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className={styles.daysContainer}>
                        {calendarDays.map((day, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`
                  ${styles.dayButton}
                  ${!day.currentMonth ? styles.otherMonth : ''}
                  ${day.isToday ? styles.today : ''}
                  ${day.isSelected ? styles.selected : ''}
                  ${day.isDisabled ? styles.disabled : ''}
                `}
                                onClick={() => !day.isDisabled && handleSelectDate(day.date)}
                                disabled={day.isDisabled}
                            >
                                {day.day}
                            </button>
                        ))}
                    </div>

                    <div className={styles.footerContainer}>
                        <button
                            type="button"
                            className={styles.footerButton}
                            onClick={goToToday}
                        >
                            {locale.today}
                        </button>
                        <button
                            type="button"
                            className={styles.footerButton}
                            onClick={clearSelection}
                        >
                            {locale.clear}
                        </button>
                        <button
                            type="button"
                            className={styles.footerButton}
                            onClick={() => setIsOpen(false)}
                        >
                            {locale.cancel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatepicker;