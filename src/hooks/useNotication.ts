import {AlertProps} from "@/components/ui/alert/Alert";
import {useState} from "react";

export const useNotification = () => {
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertProps, setAlertProps] = useState<AlertProps | null>(null);

    const showNotification = (config: AlertProps) => {
        setAlertProps(config);
        setIsAlertOpen(true);

        const timer = setTimeout(() => {
            setIsAlertOpen(false);
            setAlertProps(null);
        }, 3000);

        return () => {
            clearTimeout(timer);
            setIsAlertOpen(false);
            setAlertProps(null);
        };
    };

    return {
        isAlertOpen,
        setAlertProps,
        showNotification,
        alertProps,
    };
};