function Button({ type, variant, handleClick, className, children }) {
    return (
        <button
            type={type}
            onClick={handleClick}
            className={`py-2 px-10 ${
                variant === "dark"
                    ? "bg-normalGreen text-white"
                    : "bg-lightGreen"
            } font-semibold rounded-lg ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
