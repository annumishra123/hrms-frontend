/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2fb",
          100: "#d6e0f5",
          200: "#adc1eb",
          300: "#7f9cdc",
          400: "#5075c9",
          500: "#2f54ad",
          600: "#1e3f8f",
          700: "#162f6e",
          800: "#101f4d",
          900: "#0b1637",
          950: "#070f26",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe7fe",
          200: "#bfd6fe",
          300: "#93bcfd",
          400: "#5f9afa",
          500: "#3a78f2",
          600: "#255ce6",
          700: "#1d48c9",
          800: "#1d3ca3",
          900: "#1c3781",
          950: "#152350",
        },
        teal: {
          500: "#14b8a6",
          600: "#0d9488",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Lexend", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16, 31, 77, 0.06), 0 1px 3px 0 rgba(16, 31, 77, 0.08)",
        soft: "0 4px 14px 0 rgba(16, 31, 77, 0.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}

