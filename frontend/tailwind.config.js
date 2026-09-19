/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#EFECE2",
        panel: "#FBFAF5",
        raised: "#E7E2D3",
        line: "#D3CBB4",
        cyan: { DEFAULT: "#28567F", dim: "#274b62" },
        violet: { DEFAULT: "#5A4A80", dim: "#54384f" },
        amber: { DEFAULT: "#8C5E12" },
        ink: { DEFAULT: "#20242A", soft: "#58636b", faint: "#7c8589" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        node: "0 0 0 1px rgba(53,98,125,0.3), 0 8px 24px -14px rgba(39,49,58,0.5)",
        glow: "0 0 18px -2px rgba(53,98,125,0.28)",
      },
    },
  },
  plugins: [],
};