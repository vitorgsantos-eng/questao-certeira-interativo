import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#053A68',
          'navy-mid': '#1C5A8B',
          gold: '#AE8330',
          'gold-light': '#C59A47',
          'bg-light': '#FCF8F3',
          'gray-mid': '#8C97A4',
          'gray-soft': '#D9E1E8',
          'gray-border': '#E6EAF0',
          graphite: '#263746',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'var(--font-open-sans)', 'sans-serif'],
        display: ['var(--font-playfair)', 'var(--font-lora)', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        numbers: ['var(--font-inter)', 'var(--font-montserrat)', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(2, 38, 72, 0.08)',
        'card-hover': '0 4px 16px rgba(2, 38, 72, 0.14)',
        'gold': '0 0 0 3px rgba(196, 168, 79, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
