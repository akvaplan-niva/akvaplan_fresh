import { type Config } from "tailwindcss";
//import typography from "@tailwindcss/typography";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  //plugins: [typography],
  theme: {
    // add breakpoint (tailwind v3)
    extend: {
      screens: {
        "3xl": "120rem",
      },
    },
  },
} satisfies Config;
