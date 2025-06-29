import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Select option",
    disabled = false,
    className = "",
    ...rest
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Find selected option when value changes
    useEffect(() => {
        const option = options.find((opt) => opt.value === value);
        setSelectedOption(option || null);
        if (!option) {
            setSearchTerm("");
        }
    }, [value, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on search term
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleDropdown = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Main Input/Button */}
            <div
                className={`
                    p-2 px-3 border rounded bg-white border-slate-200 w-full 
                    flex items-center justify-between cursor-pointer
                    ${
                        disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "hover:border-gray-300"
                    }
                    ${
                        isOpen
                            ? "border-normalGreen ring-1 ring-normalGreen"
                            : ""
                    }
                `}
                onClick={handleToggleDropdown}
            >
                <div className="flex-1">
                    {isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder={
                                selectedOption
                                    ? selectedOption.label
                                    : placeholder
                            }
                            className="w-full bg-transparent outline-none"
                            disabled={disabled}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className={
                                selectedOption
                                    ? "text-gray-900"
                                    : "text-gray-500"
                            }
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </div>

            {/* Dropdown List */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="p-3 text-gray-500 text-center">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`
                                    p-3 cursor-pointer hover:bg-gray-50 transition-colors
                                    ${
                                        option.value === value
                                            ? "bg-lightGreen text-darkGreen"
                                            : ""
                                    }
                                `}
                                onClick={() => handleSelectOption(option)}
                            >
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchableSelect;
