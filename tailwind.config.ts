
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
					orange: '#FEC6A1',
					yellow: '#FEF7CD',
					green: '#F2FCE2',
					turquoise: '#D3E4FD',
					brightOrange: '#F97316',    // Added more vibrant orange
					oceanBlue: '#0EA5E9',       // Added more vibrant blue
					skyBlue: '#33C3F0',         // Kept existing vibrant blue
					turquoiseLight: '#A5D8E2',  // Kept existing turquoise
					// Earth tone palette
					sage: '#658579',
					orangeBrown: '#bd8770',
					taupe: '#aea795',
					brown: '#745641',
					cream: '#f7e2c8',
					// Oven effect colors
					ember: '#FF6B00',           // Hot orange ember color
					spark: '#FFA500',           // Bright spark color
					hotOrange: '#FF4500'        // Deep orange for hot spots
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
				},
				'ember-float': {
					'0%': {
						transform: 'translateY(0) scale(1)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'translateY(-15px) scale(1.2)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(-30px) scale(0.8)',
						opacity: '0'
					}
				},
				'spark-pulse': {
					'0%': {
						transform: 'scale(1)',
						opacity: '0.7',
						boxShadow: '0 0 4px 1px rgba(255, 165, 0, 0.7)'
					},
					'50%': {
						transform: 'scale(1.5)',
						opacity: '1',
						boxShadow: '0 0 8px 3px rgba(255, 165, 0, 0.9)'
					},
					'100%': {
						transform: 'scale(0.8)',
						opacity: '0.5',
						boxShadow: '0 0 2px 1px rgba(255, 165, 0, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
				'ember-float': 'ember-float 3s ease-in-out infinite',
				'spark-pulse': 'spark-pulse 2s ease-out infinite'
			},
			backgroundImage: {
				'glass-gradient-1': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
				'glass-gradient-2': 'linear-gradient(180deg, #bd8770 0%, #f7e2c8 100%)',
				'glass-gradient-3': 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
				'glass-gradient-4': 'linear-gradient(135deg, #745641 0%, #bd8770 100%)',
				'glass-gradient-5': 'linear-gradient(135deg, #658579 0%, #aea795 100%)',
				'earth-gradient-1': 'linear-gradient(135deg, #658579 0%, #aea795 100%)',
				'earth-gradient-2': 'linear-gradient(135deg, #bd8770 0%, #f7e2c8 100%)',
				'earth-gradient-3': 'linear-gradient(135deg, #745641 0%, #bd8770 100%)',
				// New vibrant gradients
				'vibrant-gradient-1': 'linear-gradient(135deg, #F97316 0%, #FEC6A1 100%)',
				'vibrant-gradient-2': 'linear-gradient(135deg, #33C3F0 0%, #A5D8E2 100%)',
				'vibrant-gradient-3': 'linear-gradient(135deg, #F97316 0%, #33C3F0 100%)',
				// Oven effect gradients
				'oven-gradient-1': 'linear-gradient(135deg, #000000 0%, #FF6B00 50%, #000000 100%)',
				'oven-gradient-2': 'linear-gradient(135deg, #FF4500 0%, #FFA500 50%, #FF4500 100%)',
				'oven-gradient-3': 'radial-gradient(circle, #FF6B00 0%, transparent 70%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
