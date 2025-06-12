import { useState } from "react";

export default function Input({ type, id, placeholder, className, ...rest }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className="flex relative items-center">
            <input
                type={type === "password" && isPasswordVisible ? "text" : type}
                id={id}
                {...rest}
                placeholder={placeholder}
                className={`p-2 border rounded bg-white border-slate-200 w-full ${className}`}
            />
            {/* {type === "password" && (
                <div
                    className="absolute right-4 cursor-pointer"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    {isPasswordVisible ? (
                        // EYE ICON
                    ) : (
                        // EYE OFF ICON
                    )}
                </div>
            )} */}
        </div>
    );
}
