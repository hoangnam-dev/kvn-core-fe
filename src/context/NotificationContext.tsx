'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';
import {AlertProps} from "@/components/ui/alert/Alert";

interface NotificationContextType {
    showNotification: (notification: Omit<AlertProps, 'variant'> & { variant?: AlertProps['variant'], duration?: number }) => void;
    hideNotification: () => void;
    notification: (AlertProps & { visible: boolean, duration?: number }) | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<(AlertProps & { visible: boolean, duration?: number }) | null>(null);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const hideNotification = useCallback(() => {
        setNotification((prev) => prev ? { ...prev, visible: false } : null);

        setTimeout(() => {
            setNotification(null);
        }, 300);
    }, []);

    const showNotification = useCallback((config: Omit<AlertProps, 'variant'> & { variant?: AlertProps['variant'], duration?: number }) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }

        const variant = config.variant || 'info';
        const duration = config.duration || 5000;

        setNotification({
            ...config,
            variant,
            visible: true,
            duration,
        });

        const id = setTimeout(() => {
            hideNotification();
        }, duration);

        setTimeoutId(id);
    }, [hideNotification, timeoutId]);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};