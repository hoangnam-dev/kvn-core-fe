import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "success" | "danger" | "self_danger" | "warning" | "info" | "ghost";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         size = "md",
                                         variant = "primary",
                                         startIcon,
                                         endIcon,
                                         onClick,
                                         className = "",
                                         disabled = false,
                                       }) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
  };

  // Variant Classes
  const variantClasses = {
    primary: "bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:bg-blue-300",
    outline: "bg-transparent text-black border border-black-600 hover:bg-black-100 dark:text-black-400 dark:border-black-400 hover:border-black",
    success: "bg-green-600 text-white shadow-md hover:bg-green-700 disabled:bg-green-300",
    danger: "bg-red-600 text-white shadow-md hover:bg-red-700 disabled:bg-red-300",
    warning: "bg-yellow-500 text-white shadow-md hover:bg-yellow-600 disabled:bg-yellow-300",
    info: "bg-cyan-600 text-white shadow-md hover:bg-cyan-700 disabled:bg-cyan-300",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800",
    self_danger: "border border-red-600 bg-white text-red-600 shadow-md hover:bg-red-200 disabled:bg-red-300",
  };

  return (
      <button
          className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
              sizeClasses[size]
          } ${variantClasses[variant]} ${
              disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={onClick}
          disabled={disabled}
      >
        {startIcon && <span className="flex items-center">{startIcon}</span>}
        {children}
        {endIcon && <span className="flex items-center">{endIcon}</span>}
      </button>
  );
};

export default Button;