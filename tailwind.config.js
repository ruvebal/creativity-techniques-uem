module.exports = {
	darkMode: 'class', // Enable class-based dark mode
	content: [
		'./docs/_drafts/**/*.html',
		'./docs/_includes/**/*.html',
		'./docs/_layouts/**/*.html',
		'./docs/**/*.md',
		'./docs/**/*.html',
		'./docs/lessons/**/*.{html,md}',
	],
	safelist: [
		// Rouge syntax highlighting classes (generated at runtime by Jekyll)
		{ pattern: /^highlight/ },
	],
	theme: {
		// Override default font sizes instead of creating new utilities
		fontSize: {
			xs: ['0.75rem', { lineHeight: '1.2' }],
			sm: ['0.875rem', { lineHeight: '1.35' }],
			base: ['1rem', { lineHeight: '1.7' }],
			lg: ['1.125rem', { lineHeight: '1.6' }],
			xl: ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.005em' }],
			'2xl': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
			'3xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
			'4xl': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
			'5xl': ['3.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
			'6xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
			'7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
		},
		extend: {
			colors: {
				// Map existing brand colors from site.css
				'brand-primary': 'var(--primary)',
				'brand-accent': 'var(--accent)',
				'text-primary': 'var(--text-primary)',
				'text-secondary': 'var(--text-secondary)',
				'bg-light': 'var(--bg-light)',
				'border-light': 'var(--border-light)',
				// Modern dark theme palette
				dark: {
					bg: '#0a0a0a',
					surface: '#141414',
					border: '#262626',
					text: '#f5f5f5',
					muted: '#a3a3a3',
				},
			},
			maxWidth: {
				// Academic reading widths
				prose: 'var(--max)',
				reading: '65ch',
				narrow: '45ch',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'var(--max)',
						color: 'var(--text-primary)',
						a: {
							color: 'var(--primary)',
							'&:hover': {
								color: 'var(--primary-hover)',
							},
						},
						code: {
							backgroundColor: 'var(--code-inline-bg)',
							borderColor: 'var(--code-inline-border)',
						},
						blockquote: {
							backgroundColor: 'var(--bg-light)',
							borderLeftColor: 'var(--primary)',
							color: 'var(--text-secondary)',
						},
						h1: {
							color: '#1e3a8a', // blue-900
						},
						h2: {
							color: '#1d4ed8', // blue-700
						},
						h3: {
							color: '#2563eb', // blue-600
						},
						h4: {
							color: '#3b82f6', // blue-500
						},
					},
				},
				invert: {
					css: {
						color: '#e5e5e5',
						'[class~="lead"]': {
							color: '#d4d4d4',
						},
						strong: {
							color: '#fafafa',
						},
						'ol > li::before': {
							color: '#a3a3a3',
						},
						'ul > li::before': {
							backgroundColor: '#737373',
						},
						hr: {
							borderColor: '#404040',
						},
						blockquote: {
							color: '#d4d4d4',
							borderLeftColor: '#404040',
							backgroundColor: '#171717',
						},
						h1: {
							color: '#bfdbfe', // blue-200
						},
						h2: {
							color: '#93c5fd', // blue-300
						},
						h3: {
							color: '#60a5fa', // blue-400
						},
						h4: {
							color: '#3b82f6', // blue-500
						},
						'figure figcaption': {
							color: '#a3a3a3',
						},
						a: {
							color: '#60a5fa',
						},
						'a code': {
							color: '#60a5fa',
						},
						thead: {
							color: '#fafafa',
							borderBottomColor: '#404040',
						},
						'tbody tr': {
							borderBottomColor: '#262626',
						},
						code: {
							color: '#fafafa',
							backgroundColor: '#262626',
						},
						pre: {
							color: '#e5e5e5',
							backgroundColor: '#171717',
						},
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
