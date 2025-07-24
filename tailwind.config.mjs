/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xs: '475px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(0, 65%, 97%)',
          100: 'hsl(0, 65%, 93%)',
          200: 'hsl(0, 65%, 87%)',
          300: 'hsl(0, 65%, 78%)',
          400: 'hsl(0, 65%, 66%)',
          500: 'hsl(0, 65%, 56%)',
          600: 'hsl(0, 65%, 47%)',
          700: 'hsl(0, 65%, 39%)',
          800: 'hsl(0, 65%, 31%)',
          900: 'hsl(0, 65%, 24%)',
          950: 'hsl(0, 65%, 15%)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(45, 100%, 51%)',
          foreground: 'hsl(45, 100%, 9%)',
        },
        success: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(142, 76%, 95%)',
        },
        info: {
          DEFAULT: 'hsl(210, 100%, 56%)',
          foreground: 'hsl(210, 100%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        ocean: {
          50: 'hsl(200, 100%, 97%)',
          100: 'hsl(200, 95%, 92%)',
          200: 'hsl(200, 90%, 84%)',
          300: 'hsl(200, 85%, 72%)',
          400: 'hsl(200, 80%, 58%)',
          500: 'hsl(200, 75%, 45%)',
          600: 'hsl(200, 70%, 35%)',
          700: 'hsl(200, 65%, 27%)',
          800: 'hsl(200, 60%, 20%)',
          900: 'hsl(200, 55%, 15%)',
          950: 'hsl(200, 50%, 10%)',
        },
        slate: {
          50: 'hsl(210, 40%, 98%)',
          100: 'hsl(210, 40%, 96%)',
          200: 'hsl(210, 25%, 88%)',
          300: 'hsl(210, 13%, 78%)',
          400: 'hsl(210, 9%, 65%)',
          500: 'hsl(210, 6%, 51%)',
          600: 'hsl(210, 7%, 44%)',
          700: 'hsl(210, 9%, 36%)',
          800: 'hsl(210, 10%, 23%)',
          900: 'hsl(210, 11%, 15%)',
          950: 'hsl(210, 12%, 9%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        primary: '0 4px 6px -1px rgba(216, 64, 64, 0.1), 0 2px 4px -1px rgba(216, 64, 64, 0.06)',
        'primary-lg': '0 10px 15px -3px rgba(216, 64, 64, 0.1), 0 4px 6px -2px rgba(216, 64, 64, 0.05)',
        'primary-xl': '0 20px 25px -5px rgba(216, 64, 64, 0.1), 0 10px 10px -5px rgba(216, 64, 64, 0.04)',
        glow: '0 0 20px rgba(216, 64, 64, 0.3)',
        'glow-lg': '0 0 40px rgba(216, 64, 64, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
