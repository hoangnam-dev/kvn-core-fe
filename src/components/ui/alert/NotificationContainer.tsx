'use client'

import Alert from "@/components/ui/alert/Alert";
import {useNotification} from "@/context/NotificationContext";

const NotificationContainer: React.FC = () => {
    const { notification } = useNotification();

    if (!notification) return null;

    const animationClass = notification.visible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-4';

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${animationClass}`}>
            <Alert
                variant={notification.variant}
                title={notification.title}
                message={notification.message}
                showLink={notification.showLink}
                linkHref={notification.linkHref}
                linkText={notification.linkText}
            />
        </div>
    );
};

export default NotificationContainer;