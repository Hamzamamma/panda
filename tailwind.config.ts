import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
  fontFamily: {
  sans: ['var(--font-inter)', 'sans-serif'],
  display: ['var(--font-space)', 'sans-serif'],
  },
  colors: {
            fwBlack: '#000000',
            fwPurple: '#9D4EDD',
            fwPink: '#FF006E',
            fwCream: '#FDFBF7',
            fwGray: '#F3F4F6',
            fwGreen: '#E8F5E9',
            fwGreenText: '#1B5E20',
  background: '#FDFBF7',
  foreground: '#000000',
  card: { DEFAULT: '#FFFFFF', foreground: '#000000' },
  popover: { DEFAULT: '#FFFFFF', foreground: '#000000' },
  primary: { DEFAULT: '#9D4EDD', foreground: '#ffffff' },
  secondary: { DEFAULT: '#F3F4F6', foreground: '#000000' },
  muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
  accent: { DEFAULT: '#FF006E', foreground: '#ffffff' },
  destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
  border: '#000000',
  input: '#FFFFFF',
  ring: '#9D4EDD',
  },
        boxShadow: {
            'comic': '4px 4px 0px 0px #000000',
            'comic-hover': '2px 2px 0px 0px #000000',
            'comic-sm': '2px 2px 0px 0px #000000',
        },
        backgroundImage: {
            'hero-pattern': "radial-gradient(#e5e7eb 1px, transparent 1px)",
        },
  borderRadius: { lg: '0.75rem', md: '0.5rem', sm: '0.25rem' }
  }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;