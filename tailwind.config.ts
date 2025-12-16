import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
        fontFamily: {
            sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
            display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        },
  		colors: {
            fwBlack: '#000000',
            fwPurple: '#9D4EDD',
            fwPink: '#FF006E',
            fwCream: '#FDFBF7',
            fwGray: '#F3F4F6',
            fwGreen: '#E8F5E9',
            fwGreenText: '#1B5E20',
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
  				DEFAULT: "hsl(var(--destructive))",
  				foreground: "hsl(var(--destructive-foreground))",
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
  		},
        boxShadow: {
            'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            'comic': '4px 4px 0px 0px #000000',
            'comic-hover': '2px 2px 0px 0px #000000',
            'comic-sm': '2px 2px 0px 0px #000000',
        },
        backgroundImage: {
            'hero-pattern': 'radial-gradient(#e5e7eb 1px, transparent 1px)',
        },
        backgroundSize: {
            'dots': '20px 20px',
        },
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)",
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
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  		},
  	},
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;