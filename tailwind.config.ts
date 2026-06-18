import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  //plugins:[],
  theme: {
    // add breakpoint (tailwind v3)
    extend: {
      screens: {
        "3xl": "120rem",
      },
    },
  },
} satisfies Config;
