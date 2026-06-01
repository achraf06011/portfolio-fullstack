/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#050508',
        ink: '#0a0a12',
        surface: '#0f0f1a',
        panel: '#141422',
        border: '#1e1e32',
        accent: '#6c63ff',
        'accent-2': '#ff6584',
        gold: '#f0c040',
        muted: '#4a4a6a',
        subtle: '#2a2a42',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.7), 0 0 80px rgba(108, 99, 255, 0.3)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    }
  },
  plugins: []
}
