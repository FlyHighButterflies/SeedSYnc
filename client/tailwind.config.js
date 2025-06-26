/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                darkGreen: "#27503A",
                normalGreen: "#56B280",
                lightGreen: "#CBE7D8",
                lighterGreen: "#E6F3EC",
            },
            fontFamily: {
                sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
