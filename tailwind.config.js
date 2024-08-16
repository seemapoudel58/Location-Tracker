/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {backgroundImage: {
      "homepage-bg": "url('src/assets/bg.jpg')",
    },
    blur: {
      md: "2px", // Custom blur level
    },





},
  },
  plugins: [],
}
