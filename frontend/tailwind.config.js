/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PingFang SC', 'Helvetica Neue', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          1: '#E8F3FF',
          2: '#BEDAFF',
          3: '#94BFFF',
          4: '#6AA1FF',
          5: '#4080FF',
          6: '#2563EB',
          7: '#0E42D2',
        },
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'menu': '0 8px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
