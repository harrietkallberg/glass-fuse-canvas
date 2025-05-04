
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			zIndex: {
				'0': '0',
				'5': '5',
				'10': '10',
				'20': '20',
				'30': '30',
				'40': '40',
				'50': '50',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				glass: {
					orange: '#FEC6A1',       // Soft orange
					yellow: '#FEF7CD',       // Soft yellow
					green: '#F2FCE2',        // Soft green
					turquoise: '#D3E4FD',    // Keeping this but less emphasis
					brightOrange: '#F97316', // More vibrant orange
					oceanBlue: '#0EA5E9',    // Changed - less emphasis
					skyBlue: '#33C3F0',      // Changed - less emphasis
					turquoiseLight: '#A5D8E2', // Changed - less emphasis
					// Earth tone palette - enhanced
					sage: '#8BA888',         // More vibrant sage green
					orangeBrown: '#D2946B',  // Brighter orange-brown
					taupe: '#C2B8A3',        // Lighter taupe
					brown: '#A67F5D',        // Lighter brown
					cream: '#FCF0D9',        // Warmer cream
					moss: '#606B56',         // New: moss green
					clay: '#CB8F7E',         // New: clay color
					sand: '#E6D2B5',         // New: sand color
					leaf: '#A0C1A3',         // New: leaf green
					rust: '#7E4D3A',         // New: rust color
					darkMoss: '#304D25',     // New: dark moss green
					soil: '#73594C'          // New: soil color
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 4s ease-in-out infinite'
			},
			backgroundImage: {
				'glass-gradient-1': 'linear-gradient(135deg, #FCF0D9 0%, #D2946B 100%)',
				'glass-gradient-2': 'linear-gradient(180deg, #D2946B 0%, #FCF0D9 100%)',
				'glass-gradient-3': 'linear-gradient(to top, #C2B8A3 0%, #FCF0D9 100%)',
				'glass-gradient-4': 'linear-gradient(135deg, #A67F5D 0%, #D2946B 100%)',
				'glass-gradient-5': 'linear-gradient(135deg, #8BA888 0%, #C2B8A3 100%)',
				'earth-gradient-1': 'linear-gradient(135deg, #8BA888 0%, #C2B8A3 100%)',
				'earth-gradient-2': 'linear-gradient(135deg, #D2946B 0%, #FCF0D9 100%)',
				'earth-gradient-3': 'linear-gradient(135deg, #A67F5D 0%, #D2946B 100%)',
				// New earthy gradients
				'earthy-gradient-1': 'linear-gradient(135deg, #A0C1A3 0%, #F2FCE2 100%)',
				'earthy-gradient-2': 'linear-gradient(135deg, #CB8F7E 0%, #FEC6A1 100%)',
				'earthy-gradient-3': 'linear-gradient(135deg, #8BA888 0%, #E6D2B5 100%)',
				'rusty-gradient-1': 'linear-gradient(135deg, #7E4D3A 0%, #D2946B 100%)',
				'moss-gradient-1': 'linear-gradient(135deg, #304D25 0%, #8BA888 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
