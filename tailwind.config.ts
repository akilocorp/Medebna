// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        black: '#232323',
        yellow: {
          400: '#fccc52',
        },
        gray: {
          900: '#1a1a1a'
        },
      },
    },
  },
  plugins: [],
};

export default config;
