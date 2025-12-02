import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          green: {
            50: "#f0f7f4",
            100: "#dceee4",
            200: "#bcddca",
            300: "#8fc4a6",
            400: "#5fa47a",
            500: "#3d8560",
            600: "#2d6b4e",
            700: "#255640",
            800: "#204535",
            900: "#1b392d",
            950: "#0e2018",
          },
          cream: {
            50: "#fefdfb",
            100: "#fdfaf4",
            200: "#faf4e6",
            300: "#f5ead0",
            400: "#eed9b0",
            500: "#e4c288",
            600: "#d4a862",
            700: "#c08d4a",
            800: "#9f723e",
            900: "#825f37",
            950: "#45301a",
          },
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

