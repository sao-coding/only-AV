import type { Config } from "tailwindcss"
import { PluginAPI } from "tailwindcss/types/config"
import animate from "tailwindcss-animate"

import vidstack from "@vidstack/react/tailwind.cjs"

const customVariants = ({ addVariant, matchVariant }: PluginAPI) => {
  // Strict version of `.group` to help with nesting.
  matchVariant("parent-data", (value) => `.parent[data-${value}] > &`)

  addVariant("hocus", ["&:hover", "&:focus-visible"])
  addVariant("group-hocus", [".group:hover &", ".group:focus-visible &"])
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "media-brand": "rgb(var(--media-brand) / <alpha-value>)",
        "media-focus": "rgb(var(--media-focus) / <alpha-value>)"
      }
    }
  },
  plugins: [
    vidstack({
      // Optimize output by specifying player selector.
      // selector: "#player",
      // Change the media variants prefix.
      prefix: "media"
    }),
    animate,
    customVariants
  ]
}

export default config
