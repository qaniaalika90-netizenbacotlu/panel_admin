/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        card: "#0f141b",
        gold: "#d4af37",
        goldDim: "#b9972a",
      },
      boxShadow: {
        soft: "0 6px 16px rgba(0,0,0,.35)",
      },
    },
  },
  plugins: [],
};
