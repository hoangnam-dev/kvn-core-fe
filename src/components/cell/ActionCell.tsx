import React from "react";

export type ActionButtonType = "default" | "disable" | "highlight";

interface ActionCellButtonProps {
    type: ActionButtonType;
    children?: React.ReactNode;
    onClick?: () => void;
}

const ActionCellButton: React.FC<ActionCellButtonProps> = ({ type, children, onClick  }) => {
    const baseClass =
        "inline-flex items-center justify-center relative box-border tap-highlight-transparent bg-transparent user-select-none align-middle appearance-none text-center text-2xl outline-none border-0 m-0 no-underline flex-none p-2 rounded-full overflow-visible transition-all duration-150 ease-in-out";

    const typeClass = {
        disable:
            "pointer-events-none cursor-default text-[rgba(145,158,171,0.8)] dark:text-[rgba(145,158,171,0.5)]",
        highlight:
            "cursor-pointer text-[rgb(255,171,0)] font-normal hover:font-bold hover:bg-[rgba(255,171,0,0.2)] hover:shadow-md dark:text-[rgb(255,200,100)] dark:hover:bg-[rgba(255,200,100,0.2)]",
        default:
            "cursor-pointer text-[rgb(99,115,129)] font-normal hover:font-bold hover:bg-[rgba(99,115,129,0.2)] hover:shadow-md dark:text-[rgb(200,200,200)] dark:hover:bg-[rgba(200,200,200,0.2)]",
    };

    return <button className={`${baseClass} ${typeClass[type]}`} onClick={type !== "disable" ? onClick : undefined}>{children}</button>
};

export default ActionCellButton;
