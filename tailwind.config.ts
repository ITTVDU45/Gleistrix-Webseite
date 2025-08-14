import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f5c518",
        secondary: "#1f2937",
        background: "#ffffff",
        text: "#111827",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;


