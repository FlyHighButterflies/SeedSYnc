import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
    options = [],
    id,
    placeholder,
    className,
    value,
    onChange,
    ...rest
}) {
    const [selected, setSelected] = useState("");

    // Update the local state when the form updates the value
    useEffect(() => {
        if (value !== undefined) {
            setSelected(value);
        }
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSelected(newValue);

        // If this is controlled by React Hook Form
        if (onChange) {
            onChange(e);
        }
    };

    // Key fix: Always display selected value as black text
    const displayValue = selected ? selected : "";
    const hasSelection = displayValue !== "";

    return (
        <div className="flex relative items-center">
            <select
                id={id}
                value={displayValue}
                onChange={handleChange}
                className={`appearance-none p-2 px-3 pr-10 border rounded bg-white border-slate-200 w-full ${
                    hasSelection ? "text-black" : "text-slate-400"
                } ${className}`}
                {...rest}
            >
                <option value="" disabled>
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
