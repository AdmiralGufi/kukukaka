/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futuristic: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00faff, 0 0 20px #00faff',
      },
    },
  },
  plugins: [],
};
