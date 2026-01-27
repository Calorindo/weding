/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                pastel: {
                    green: '#D4EAC8', // Keeping as legacy request
                    darkGreen: '#A4C3A2',
                    bg: '#FBFBFB', // Reference Site Background
                    text: '#4B4B4B', // Reference Site Text (Dark Gray)
                },
                charcoal: {
                    DEFAULT: '#4B4B4B', // Reference Site Main Heading Color
                    dark: '#14171A', // Reference Site Button/Accent
                    light: '#6B6B6B'
                }
            },
            fontFamily: {
                sans: ['"Lato"', 'sans-serif'],
                heading: ['"Raleway"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                cursive: ['"Great Vibes"', 'cursive'],
            }
        },
    },
    plugins: [],
}
