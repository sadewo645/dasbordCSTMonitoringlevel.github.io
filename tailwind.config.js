/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#030712",
        panel: "#0b1224",
        glow: "#00b7ff"
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,183,255,0.25)",
        card: "0 0 0 1px rgba(56,189,248,0.25), 0 0 30px rgba(14,165,233,0.15)"
      }
    }
  },
  plugins: []
};
