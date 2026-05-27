import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#211E1A",
          charcoal: "#2A2520",
          stone: "#766E63",
          gold: "#B89A5E",
          cream: "#F7F3EA",
          ivory: "#F7F3EA",
          porcelain: "#FFFCF6",
          red: "#BF2135",
          navy: "#0E1F35"
        }
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        zh: ["var(--font-noto-sans)", "var(--font-noto-serif)", "sans-serif"],
        "zh-serif": ["var(--font-noto-serif)", "serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(33, 30, 26, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
