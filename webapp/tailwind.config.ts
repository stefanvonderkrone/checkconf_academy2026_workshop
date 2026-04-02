import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      padding: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
      colors: {
        primary: { DEFAULT: "#003580", light: "#0055a6" },
      },
    },
  },
} satisfies Config;
