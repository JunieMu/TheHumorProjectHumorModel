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
        vintage: {
          cream: "#fdfbf7",
          "cream-dark": "#f5f1e9",
          blue: "#a8dadc",
          "blue-dark": "#457b9d",
          green: "#ccd5ae",
          "green-dark": "#7b8a56",
          yellow: "#faedcd",
          "yellow-dark": "#d4a373",
          pink: "#fec89a",
          "pink-dark": "#e76f51",
          gray: "#3d405b",
        },
      },
      fontFamily: {
        typewriter: ["Courier Prime", "Courier New", "Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
