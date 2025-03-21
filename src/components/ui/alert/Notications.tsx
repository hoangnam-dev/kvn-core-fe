'use client';

import React from 'react';

interface NotificationProps {
    title: string;
    message: string;
}

const NotificationCenter: React.FC<NotificationProps> = ({ title, message }) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center justify-between gap-3 w-full sm:max-w-[340px] rounded-md border-b-4 p-3 shadow-theme-sm dark:bg-[#1E2634] border-blue-light-500">
                <div className="flex items-center gap-4">
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-light-50 text-blue-light-500">
                        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                             viewBox="0 0 24 24" fill="none">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.6501 11.9996C3.6501 7.38803 7.38852 3.64961 12.0001 3.64961C16.6117 3.64961 20.3501 7.38803 20.3501 11.9996C20.3501 16.6112 16.6117 20.3496 12.0001 20.3496C7.38852 20.3496 3.6501 16.6112 3.6501 11.9996ZM12.0001 1.84961C6.39441 1.84961 1.8501 6.39392 1.8501 11.9996C1.8501 17.6053 6.39441 22.1496 12.0001 22.1496C17.6058 22.1496 22.1501 17.6053 22.1501 11.9996C22.1501 6.39392 17.6058 1.84961 12.0001 1.84961ZM10.9992 7.52468C10.9992 8.07697 11.4469 8.52468 11.9992 8.52468H12.0002C12.5525 8.52468 13.0002 8.07697 13.0002 7.52468C13.0002 6.9724 12.5525 6.52468 12.0002 6.52468H11.9992C11.4469 6.52468 10.9992 6.9724 10.9992 7.52468ZM12.0002 17.371C11.586 17.371 11.2502 17.0352 11.2502 16.621V10.9445C11.2502 10.5303 11.586 10.1945 12.0002 10.1945C12.4144 10.1945 12.7502 10.5303 12.7502 10.9445V16.621C12.7502 17.0352 12.4144 17.371 12.0002 17.371Z"
                                fill="#0BA5EC"
                            ></path>
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-800 sm:text-base dark:text-white/90">{title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;