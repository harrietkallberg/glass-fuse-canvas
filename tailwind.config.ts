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
					// New fluid art colors
					darkTeal: '#00757F',        // Dark teal for streamlines
					mediumTeal: '#00A9B5',      // Medium teal for particles
					vibrantOrange: '#FF7A00',   // Vibrant orange for streamlines
					opaqueWhite: '#FFFFFF'      // White for particles and blobs
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
				'blob-float': {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)',
						borderRadius: '60% 40% 70% 30% / 50% 50% 50% 50%',
					},
					'25%': {
						transform: 'translate(5px, -5px) scale(1.02) rotate(2deg)',
						borderRadius: '40% 60% 30% 70% / 60% 30% 70% 40%',
					},
					'50%': {
						transform: 'translate(-5px, 10px) scale(0.98) rotate(-2deg)',
						borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%',
					},
					'75%': {
						transform: 'translate(10px, 5px) scale(1.01) rotate(1deg)',
						borderRadius: '50% 50% 20% 80% / 70% 30% 60% 40%',
					}
				},
				'blob-float-reverse': {
					'0%, 100%': {
						transform: 'translate(0, 0) scale(1)',
						borderRadius: '50% 50% 50% 50%',
					},
					'25%': {
						transform: 'translate(-8px, 7px) scale(1.04) rotate(-1deg)',
						borderRadius: '70% 30% 40% 60% / 40% 60% 40% 60%',
					},
					'50%': {
						transform: 'translate(10px, -10px) scale(0.97) rotate(2deg)',
						borderRadius: '30% 70% 60% 40% / 60% 40% 60% 40%',
					},
					'75%': {
						transform: 'translate(-7px, -5px) scale(1.03) rotate(-2deg)',
						borderRadius: '40% 60% 50% 50% / 50% 40% 60% 50%',
					}
				},
				'particle-pulse': {
					'0%, 100%': {
						transform: 'scale(1)',
						opacity: '0.8',
					},
					'50%': {
						transform: 'scale(1.1)',
						opacity: '1',
					}
				},
				'streamline-flow': {
					'0%': {
						backgroundPosition: '0% 50%',
						opacity: '0.7',
					},
					'50%': {
						backgroundPosition: '100% 50%',
						opacity: '0.9',
					},
					'100%': {
						backgroundPosition: '0% 50%',
						opacity: '0.7',
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
				'blob-float-slow': 'blob-float 20s ease-in-out infinite',
				'blob-float-medium': 'blob-float 15s ease-in-out infinite',
				'blob-float-fast': 'blob-float 12s ease-in-out infinite',
				'blob-float-reverse-slow': 'blob-float-reverse 18s ease-in-out infinite',
				'blob-float-reverse-medium': 'blob-float-reverse 14s ease-in-out infinite',
				'particle-pulse-slow': 'particle-pulse 10s ease-in-out infinite',
				'particle-pulse-medium': 'particle-pulse 7s ease-in-out infinite',
				'particle-pulse-fast': 'particle-pulse 5s ease-in-out infinite',
				'streamline-flow-slow': 'streamline-flow 25s ease infinite',
				'streamline-flow-medium': 'streamline-flow 18s ease infinite',
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
				'streamline-teal': 'linear-gradient(90deg, rgba(0,117,127,0), rgba(0,117,127,0.7), rgba(0,117,127,0))',
				'streamline-orange': 'linear-gradient(90deg, rgba(255,122,0,0), rgba(255,122,0,0.7), rgba(255,122,0,0))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
