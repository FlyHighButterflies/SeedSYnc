import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ type, id, placeholder, className, ...rest }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className="flex relative items-center">
            <input
                type={type === "password" && isPasswordVisible ? "text" : type}
                id={id}
                {...rest}
                placeholder={placeholder}
                className={`p-2 px-3 border rounded bg-white border-slate-200 w-full ${className}`}
            />
            {type === "password" && (
                <div
                    className="absolute right-4 cursor-pointer"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    {isPasswordVisible ? (
                        <Eye size={20} color="#8A8B8B" />
                    ) : (
                        <EyeOff size={20} color="#8A8B8B" />
                    )}
                </div>
            )}
        </div>
    );
}
