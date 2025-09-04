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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				tetris: {
					i: 'hsl(var(--tetris-i))',
					o: 'hsl(var(--tetris-o))',
					t: 'hsl(var(--tetris-t))',
					s: 'hsl(var(--tetris-s))',
					z: 'hsl(var(--tetris-z))',
					j: 'hsl(var(--tetris-j))',
					l: 'hsl(var(--tetris-l))'
				},
				game: {
					board: 'hsl(var(--game-board))',
					border: 'hsl(var(--game-border))',
					grid: 'hsl(var(--game-grid))',
					text: 'hsl(var(--game-text))',
					accent: 'hsl(var(--game-accent))',
					score: 'hsl(var(--game-score))'
				},
				'block-shadow': {
					light: 'hsl(var(--block-shadow-light))',
					dark: 'hsl(var(--block-shadow-dark))'
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
				'line-clear': {
					'0%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.5',
						transform: 'scale(1.1)'
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0.8)'
					}
				},
				'piece-land': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 5px hsl(var(--glow-primary)), 0 0 10px hsl(var(--glow-primary)), 0 0 15px hsl(var(--glow-primary))'
					},
					'50%': {
						boxShadow: '0 0 10px hsl(var(--glow-primary)), 0 0 20px hsl(var(--glow-primary)), 0 0 30px hsl(var(--glow-primary))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'line-clear': 'line-clear 0.5s ease-out',
				'piece-land': 'piece-land 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
