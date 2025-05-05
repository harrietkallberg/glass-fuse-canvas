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
					cream: '#f7e2c8'
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
                'glass-morph': {
                    '0%, 100%': {
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                        transform: 'translate(0) rotate(0deg)'
                    },
                    '33%': {
                        borderRadius: '70% 30% 50% 50% / 30% 50% 50% 70%',
                        transform: 'translate(2%, 5%) rotate(5deg)'
                    },
                    '66%': {
                        borderRadius: '40% 60% 60% 40% / 70% 40% 30% 60%',
                        transform: 'translate(-2%, -5%) rotate(-5deg)'
                    }
                },
                /* Watercolor blob animations */
                'blob-float-large': {
                    '0%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '60% 40% 70% 30% / 40% 50% 60% 50%'
                    },
                    '33%': {
                        transform: 'translate(2%, -3%) scale(1.05) rotate(5deg)',
                        borderRadius: '50% 60% 30% 70% / 60% 40% 70% 30%'
                    },
                    '66%': {
                        transform: 'translate(-2%, 2%) scale(0.98) rotate(-3deg)',
                        borderRadius: '70% 30% 50% 50% / 30% 60% 40% 70%'
                    },
                    '100%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '60% 40% 70% 30% / 40% 50% 60% 50%'
                    }
                },
                'blob-float-medium': {
                    '0%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%'
                    },
                    '33%': {
                        transform: 'translate(-3%, 2%) scale(1.03) rotate(-5deg)',
                        borderRadius: '50% 50% 40% 60% / 40% 60% 30% 70%'
                    },
                    '66%': {
                        transform: 'translate(1%, -2%) scale(0.97) rotate(4deg)',
                        borderRadius: '60% 40% 50% 50% / 30% 50% 60% 40%'
                    },
                    '100%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%'
                    }
                },
                'blob-float-small': {
                    '0%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '50% 50% 60% 40% / 40% 60% 50% 60%'
                    },
                    '33%': {
                        transform: 'translate(3%, 2%) scale(1.08) rotate(3deg)',
                        borderRadius: '60% 40% 40% 60% / 50% 40% 60% 50%'
                    },
                    '66%': {
                        transform: 'translate(-2%, -1%) scale(0.95) rotate(-4deg)',
                        borderRadius: '40% 60% 50% 50% / 60% 50% 40% 50%'
                    },
                    '100%': {
                        transform: 'translate(0, 0) scale(1) rotate(0)',
                        borderRadius: '50% 50% 60% 40% / 40% 60% 50% 60%'
                    }
                },
                'blob-float-subtle': {
                    '0%': {
                        transform: 'translate(0, 0) scale(1)',
                        borderRadius: '50%'
                    },
                    '50%': {
                        transform: 'translate(1%, -1%) scale(1.1)',
                        borderRadius: '45% 55% 60% 40% / 55% 45% 50% 45%'
                    },
                    '100%': {
                        transform: 'translate(0, 0) scale(1)',
                        borderRadius: '50%'
                    }
                },
                'blob-pulse': {
                    '0%': {
                        transform: 'scale(1)',
                        opacity: '0.4'
                    },
                    '50%': {
                        transform: 'scale(1.15)',
                        opacity: '0.6'
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: '0.4'
                    }
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
                'glass-morph': 'glass-morph 20s ease-in-out infinite',
                /* New watercolor blob animations */
                'blob-float-large': 'blob-float-large 25s ease-in-out infinite',
                'blob-float-medium': 'blob-float-medium 20s ease-in-out infinite',
                'blob-float-small': 'blob-float-small 18s ease-in-out infinite',
                'blob-float-subtle': 'blob-float-subtle 15s ease-in-out infinite',
                'blob-pulse': 'blob-pulse 10s ease-in-out infinite',
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
				'vibrant-gradient-1': 'linear-gradient(135deg, #F97316 0%, #FEC6A1 100%)',
				'vibrant-gradient-2': 'linear-gradient(135deg, #33C3F0 0%, #A5D8E2 100%)',
				'vibrant-gradient-3': 'linear-gradient(135deg, #F97316 0%, #33C3F0 100%)',
                'glass-shine': 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                'glass-highlight': 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, transparent 70%)',
                'glass-orange-blue': 'linear-gradient(135deg, rgba(249,115,22,0.4) 0%, rgba(51,195,240,0.4) 100%)',
                'radial-subtle': 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 70%, rgba(0,0,0,0.05) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
