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
                'fluid-morph': {
                    '0%, 100%': {
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                        transform: 'translate(0px, 0px) rotate(0deg) scale(1)'
                    },
                    '33%': {
                        borderRadius: '40% 60% 70% 30% / 30% 40% 70% 60%',
                        transform: 'translate(50px, -20px) rotate(8deg) scale(1.1)'
                    },
                    '66%': {
                        borderRadius: '70% 30% 40% 60% / 60% 70% 30% 40%',
                        transform: 'translate(-40px, 40px) rotate(-10deg) scale(0.95)'
                    }
                },
                'fluid-morph-alt': {
                    '0%, 100%': {
                        borderRadius: '40% 60% 70% 30% / 40% 60% 30% 70%',
                        transform: 'translate(0px, 0px) rotate(0deg) scale(1)'
                    },
                    '33%': {
                        borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
                        transform: 'translate(-40px, 30px) rotate(-5deg) scale(1.05)'
                    },
                    '66%': {
                        borderRadius: '30% 70% 60% 40% / 50% 60% 40% 50%',
                        transform: 'translate(30px, -40px) rotate(8deg) scale(0.98)'
                    }
                },
                'fluid-morph-slow': {
                    '0%, 100%': {
                        borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%',
                        transform: 'translate(0px, 0px) rotate(0deg) scale(1)'
                    },
                    '25%': {
                        borderRadius: '60% 40% 50% 50% / 40% 50% 50% 60%',
                        transform: 'translate(20px, -15px) rotate(5deg) scale(1.05)'
                    },
                    '50%': {
                        borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%',
                        transform: 'translate(0px, 25px) rotate(0deg) scale(1.1)'
                    },
                    '75%': {
                        borderRadius: '40% 60% 50% 50% / 60% 40% 50% 50%',
                        transform: 'translate(-20px, -10px) rotate(-5deg) scale(1.02)'
                    }
                },
                'bubble-float': {
                    '0%': {
                        transform: 'translateY(0) translateX(0) scale(1) rotate(0deg)',
                        opacity: '0.7'
                    },
                    '33%': {
                        transform: 'translateY(-30px) translateX(20px) scale(1.05) rotate(5deg)',
                        opacity: '0.9'
                    },
                    '66%': {
                        transform: 'translateY(-15px) translateX(-25px) scale(0.95) rotate(-8deg)',
                        opacity: '0.8'
                    },
                    '100%': {
                        transform: 'translateY(0) translateX(0) scale(1) rotate(0deg)',
                        opacity: '0.7'
                    }
                },
                'bubble-float-small': {
                    '0%': {
                        transform: 'translateY(0) translateX(0) scale(1)',
                        opacity: '0.8'
                    },
                    '25%': {
                        transform: 'translateY(-15px) translateX(10px) scale(1.1)',
                        opacity: '1'
                    },
                    '50%': {
                        transform: 'translateY(-25px) translateX(15px) scale(1.05)',
                        opacity: '0.9'
                    },
                    '75%': {
                        transform: 'translateY(-10px) translateX(-10px) scale(0.95)',
                        opacity: '0.85'
                    },
                    '100%': {
                        transform: 'translateY(0) translateX(0) scale(1)',
                        opacity: '0.8'
                    }
                },
                'droplet-float': {
                    '0%': {
                        transform: 'translateY(0) translateX(0)',
                        opacity: '0.9'
                    },
                    '50%': {
                        transform: 'translateY(-10px) translateX(5px)',
                        opacity: '1'
                    },
                    '100%': {
                        transform: 'translateY(0) translateX(0)',
                        opacity: '0.9'
                    }
                },
                'color-swirl': {
                    '0%': {
                        transform: 'rotate(0deg) scale(1)',
                        opacity: '0.3',
                        filter: 'blur(10px)'
                    },
                    '50%': {
                        transform: 'rotate(180deg) scale(1.1)',
                        opacity: '0.4',
                        filter: 'blur(15px)'
                    },
                    '100%': {
                        transform: 'rotate(360deg) scale(1)',
                        opacity: '0.3',
                        filter: 'blur(10px)'
                    }
                },
                'shine-sweep': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
                'glass-morph': 'glass-morph 20s ease-in-out infinite',
                'fluid-morph': 'fluid-morph 30s ease-in-out infinite',
                'fluid-morph-alt': 'fluid-morph-alt 35s ease-in-out infinite',
                'fluid-morph-slow': 'fluid-morph-slow 45s ease-in-out infinite',
                'bubble-float': 'bubble-float 25s ease-in-out infinite',
                'bubble-float-small': 'bubble-float-small 18s ease-in-out infinite',
                'droplet-float': 'droplet-float 12s ease-in-out infinite',
                'color-swirl': 'color-swirl 40s linear infinite',
                'shine-sweep': 'shine-sweep 8s ease-in-out infinite',
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
