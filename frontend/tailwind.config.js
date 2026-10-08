/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#06090e', // Deepest background
                    800: '#0d131a', // Card background
                    700: '#141d26', // Lighter card background
                    600: '#1c2733', // Border/Divider
                    500: '#2b394a', // Muted text
                    400: '#475e75', // Less muted text
                },
                brand: {
                    DEFAULT: '#00f2fe',
                    green: '#10b981', // Neon emerald
                    teal: '#14b8a6',  // Cyan/teal
                    purple: '#8b5cf6', // Neon purple
                    red: '#ef4444',    // Error/Negative
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(180deg, rgba(20, 29, 38, 0.4) 0%, rgba(13, 19, 26, 0.8) 100%)',
            },
            boxShadow: {
                'neon-green': '0 0 10px rgba(16, 185, 129, 0.5)',
                'neon-teal': '0 0 10px rgba(20, 184, 166, 0.5)',
                'glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }
        },
    },
    plugins: [],
}
