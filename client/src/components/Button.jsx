import React from "react";

function Button({ type, className, children }) {
    return (
        <button
            type={type}
            className={`py-2 px-10 bg-normalGreen rounded-lg ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
