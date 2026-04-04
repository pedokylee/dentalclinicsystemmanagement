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
                darkBg: '#061A18',
                deepTeal: '#0B5E57',
                primaryTeal: '#0D9488',
                mediumTeal: '#14B8A6',
                brightMint: '#2DD4BF',
                lightMint: '#99F6E4',
                goldAccent: '#F59E0B',
            },

        },
    },

    plugins: [forms],
};
