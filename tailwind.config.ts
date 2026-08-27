import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        charcoal: "#2a2a2a",
        graphite: "#525252",
        stone: "#737373",
        silver: "#a3a3a3",
        rule: "#e5e5e5",
        surface: "#f7f6f3",
        paper: "#ffffff",
        accent: "#00A86B",
        /* Legacy aliases */
        obsidian: "#171717",
        ember: "#00A86B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      maxWidth: {
        container: "1200px",
        editorial: "1280px",
        measure: "720px",
      },
      boxShadow: {
        floating: "0 8px 30px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 12px 0 rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        card: "16px",
        icon: "12px",
        pill: "9999px",
        badge: "8px",
        input: "10px",
        btn: "10px",
      },
      fontSize: {
        display: ["clamp(2.75rem, 5vw, 4.5rem)", { lineHeight: "1.02" }],
        "article-title": ["clamp(2.25rem, 4vw, 4rem)", { lineHeight: "1.05" }],
      },
    },
  },
  plugins: [],
};

export default config;
