/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // ---- SevaSathi palette (design.md §2) ----
        cream: {
          50: "#FDFAF4",
          100: "#FAF4E8",
        },
        sand: {
          200: "#F2E9D8",
        },
        ink: {
          900: "#2C2721",
          600: "#5E564A",
          400: "#8A7F6F",
        },
        terracotta: {
          50: "#FBEFE7",
          100: "#F8E3D6",
          500: "#D2673C",
          600: "#C0552B",
          700: "#A84A22",
        },
        leaf: {
          100: "#E2EDE2",
          500: "#4F8465",
          600: "#3E6B50",
          700: "#2F5240",
        },
        amber: {
          100: "#F8ECD3",
          500: "#D9A03F",
          600: "#B97F24",
        },
        rose: {
          100: "#F6E2E0",
          500: "#BC6B6F",
        },
        cocoa: {
          100: "#EFE6DA",
          500: "#8A6D4F",
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Hind"', 'system-ui', 'sans-serif'],
        sans: ['"Hind"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glass: "0 10px 36px -12px rgba(94,66,41,0.18)",
        "glass-sm": "0 4px 24px rgba(94,66,41,0.12)",
        warm: "0 8px 24px -8px rgba(192,85,43,0.35)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "blob-drift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(30px,24px) scale(1.04)" },
        },
        "pulse-dot": {
          "0%,100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.35)", opacity: "0.4" },
        },
        breathe: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "float-y": {
          "0%,100%": { transform: "translateY(-8px)" },
          "50%": { transform: "translateY(8px)" },
        },
        "bar-pulse": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.22,1,0.36,1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.22,1,0.36,1)",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 22s linear infinite",
        "blob-drift": "blob-drift 60s ease-in-out infinite alternate",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
        "float-y": "float-y 6s ease-in-out infinite",
        "bar-pulse": "bar-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
