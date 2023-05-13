/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontSize: {

            ss: '0.5rem',
            sm: '0.8rem',
            base: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem',
        },
        screens: {
            'sx': '380px',

            'sm': '640px',
            // => @media (min-width: 640px) { ... }
            'md': '768px',

            'tx': '800px',

            // 'mx': '878px',

            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
            '3xl': '2000px',
        },
        extend: {},
    },
    plugins: [require("flowbite/plugin"),
        require("tailwind-scrollbar-hide"),
    ],
}