import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#562BD6",
          light: "#EDE8FB",
          dark: "#3D1FA3",
        },
        accent: {
          DEFAULT: "#A60F30",
          light: "#FAEAED",
        },
        black: "#1A1A1A",
        gray: {
          DEFAULT: "#6B6B6B",
          light: "#F5F5F5",
        },
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
