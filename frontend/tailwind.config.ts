import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#218085',
          light: '#32b8c6',
          dark: '#1d7480',
        },
        background: {
          DEFAULT: '#fcfcf9',
          dark: '#1f2121',
        },
        surface: {
          DEFAULT: '#fffffd',
          dark: '#262828',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config
