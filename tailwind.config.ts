import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F0",
        warm: "#FFFDF9",
        peach: "#F5DCC8",
        coral: {
          DEFAULT: "#E8704A",
          dark: "#C4522E",
          light: "#FAE8DF",
        },
        sage: {
          DEFAULT: "#7A9E7E",
          dark: "#4F6B53",
          light: "#E8F0E9",
        },
        charcoal: "#2C2824",
        muted: "#7A6F65",
        line: "#E7DFD2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.55s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
