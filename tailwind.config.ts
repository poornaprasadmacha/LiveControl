import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1e3a8a',
          primaryDark: '#172554',
          primaryLight: '#2563eb',
          secondary: '#047857',
          secondaryDark: '#065f46',
          secondaryLight: '#10b981',
          light: '#e2e8f0',
          veryLight: '#f1f5f9',
          bgLight: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          darkBg: '#f8fafc',
          darkCard: '#ffffff',
          darkBorder: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'var(--font-poppins)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        none: 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'pulse-slow': 'pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
