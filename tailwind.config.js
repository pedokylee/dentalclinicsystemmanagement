import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Calibri', 'system-ui', 'sans-serif'],
                heading: ['"Trebuchet MS"', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Original brand colors (kept for backwards compatibility)
                darkBg: '#061A18',
                deepTeal: '#0B5E57',
                primaryTeal: '#0D9488',
                mediumTeal: '#14B8A6',
                brightMint: '#2DD4BF',
                lightMint: '#99F6E4',
                goldAccent: '#F59E0B',
                
                // New unified brand color palette
                'brand': {
                    'primary': '#0D9488',           // Main teal
                    'primary-dark': '#0A7A70',     // Button hover/active
                    'primary-light': '#14B8A6',    // Lighter accent
                    'primary-very-dark': '#086860', // Active/pressed state
                    'bg-dark': '#0E2C28',          // Dark page background
                    'bg-darker': '#061A18',        // Darkest background (headers, overlays)
                    'bg-hover': '#0F2724',         // Dark hover state
                    'text-light': '#E2FAF7',       // Light text on dark
                    'text-muted': '#7ABFB9',       // Secondary text
                    'text-muted-dark': '#4A8C85',  // Dark secondary text
                    'border-light': 'rgba(45,212,191,0.12)', // Subtle border
                    'accent-warning': '#F59E0B'   // Warning accent
                }
            },
            spacing: {
                'section': '1.5rem',       // 24px - for major sections
                'card': '1.5rem',          // 24px - for card padding
                'component': '1rem',       // 16px - for component internal spacing
                'input': '0.75rem',        // 12px - for form field spacing
            },
            borderRadius: {
                'button': '0.5rem',       // 8px
                'card': '0.75rem',        // 12px
                'input': '0.5rem',        // 8px
                'pill': '9999px'          // Full rounding
            }
        },
    },

    plugins: [forms],
};

