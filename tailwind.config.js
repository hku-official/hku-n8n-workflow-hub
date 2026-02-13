/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        n8n: {
          primary: '#ff6d5a',
          secondary: '#1a1a2e',
          dark: '#0f0f23',
          accent: '#e94e77',
          surface: '#16213e',
          muted: '#94a3b8',
        },
        hku: {
          green: '#006747',
          'green-light': '#008a5e',
          'green-dark': '#004d35',
          gold: '#b4985a',
          bg: '#ffffff',
          'bg-alt': '#f5f5f5',
          border: '#e0e0e0',
          text: '#333333',
          'text-light': '#666666',
          'text-muted': '#999999',
        },
      },
    },
  },
  plugins: [],
};
