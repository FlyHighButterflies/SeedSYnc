import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
    options = [],
    id,
    placeholder,
    className,
    ...rest
}) {
    const [selected, setSelected] = useState("");

    const isPlaceholder = selected === "";

    return (
        <div className="flex relative items-center">
            <select
                id={id}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={`appearance-none p-2 px-3 pr-10 border rounded bg-white border-slate-200 w-full ${
                    isPlaceholder ? "text-slate-400" : "text-black"
                } ${className}`}
                {...rest}
            >
                <option value="" disabled hidden>
                    {placeholder || "-- Select --"}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <div className="absolute right-4 pointer-events-none">
                <ChevronDown size={20} color="#8A8B8B" />
            </div>
        </div>
    );
}
