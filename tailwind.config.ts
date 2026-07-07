import type { Config } from 'tailwindcss'

export default {
    content: [],
    darkMode: 'class',
    corePlugins: {
        preflight: false, // Vuetify owns the reset — never let them fight
    },
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#0F766E', dark: '#14B8A6' },
                secondary: { DEFAULT: '#3B82F6', dark: '#60A5FA' },
                accent: { DEFAULT: '#F59E0B', dark: '#FBBF24' },
            },
            fontFamily: {
                heading: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'sans-serif'],
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
            },
            borderRadius: {
                card: '16px',
                control: '12px',
            },
        },
    },
} satisfies Config
