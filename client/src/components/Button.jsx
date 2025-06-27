import React from "react";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors";

    const variants = {
        primary: "bg-normalGreen text-white hover:bg-darkGreen",
        secondary:
            "bg-lightGreen text-darkGreen hover:bg-normalGreen hover:text-white",
        outline:
            "border border-normalGreen text-normalGreen bg-white hover:bg-lightGreen",
        ghost: "text-darkGreen hover:bg-lighterGreen",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.md;

    return (
        <button
            className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
