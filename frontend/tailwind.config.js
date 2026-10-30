export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        canvas: "#f3f1ec",
        panel: "#fffefa",
        raised: "#ebe8e1",
        line: "#ddd8ce",
        "line-strong": "#bdb6aa",

        // Existing cyan/teal classes now use the terracotta accent.
        cyan: {
          DEFAULT: "#b9573f",
          dim: "#8f3f2f",
        },

        teal: {
          DEFAULT: "#66745d",
          dim: "#4f5c48",
        },

        blue: "#64748b",
        purple: "#756477",
        indigo: "#596579",
        slate: "#77736b",

        ink: {
          DEFAULT: "#252522",
          soft: "#6d6a63",
          faint: "#98938a",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },

      boxShadow: {
        node: "0 5px 18px rgba(48, 43, 35, 0.08)",
        panel: "0 1px 2px rgba(48, 43, 35, 0.05)",
        glow: "0 4px 14px rgba(185, 87, 63, 0.14)",
      },

      borderRadius: {
        xl: "0.8rem",
        "2xl": "1rem",
      },
    },
  },

  plugins: [],
};
