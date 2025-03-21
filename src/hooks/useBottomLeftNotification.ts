'use client'

import {AlertProps} from "@/components/ui/alert/Alert";
import {useNotification} from "@/context/NotificationContext";


type NotificationOptions = Omit<AlertProps, 'variant'> & {
    variant?: AlertProps['variant'];
    duration?: number;
};

export const useBottomLeftNotification = () => {
    const { showNotification, hideNotification } = useNotification();

    const notify = (options: NotificationOptions) => {
        showNotification(options);
    };

    return {
        success: (options: Omit<NotificationOptions, 'variant'>) =>
            notify({ ...options, variant: 'success' }),
        error: (options: Omit<NotificationOptions, 'variant'>) =>
            notify({ ...options, variant: 'error' }),
        warning: (options: Omit<NotificationOptions, 'variant'>) =>
            notify({ ...options, variant: 'warning' }),
        info: (options: Omit<NotificationOptions, 'variant'>) =>
            notify({ ...options, variant: 'info' }),
        hide: hideNotification
    };
};