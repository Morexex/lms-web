export default defineNuxtConfig({
    compatibilityDate: '2026-07-01',
    devtools: { enabled: true },

    modules: ['vuetify-nuxt-module', '@nuxtjs/tailwindcss', '@nuxt/fonts', '@pinia/nuxt', '@nuxt/eslint'],

    components: [{ path: '~/components', pathPrefix: false }],

    // NOTE: no pageTransition — Vue transitions around async pages can freeze
    // mid-fade (pages stuck half-transparent after client-side navigation).
    // Motion lives in pure CSS (hover/press) where it can't break rendering.

    imports: {
        dirs: ['composables/**'],   // auto-import nested composables (composables/api/…)
    },

    runtimeConfig: {
        public: {
            // SSR talks straight to the backend; the browser goes through the
            // same-origin proxy so the httpOnly refresh cookie is first-party.
            apiBaseServer: process.env.NUXT_PUBLIC_API_BASE_SERVER || 'http://lms-api.test',
            apiBaseClient: '',
        },
    },

    nitro: {
        devProxy: {
            '/api': { target: 'http://lms-api.test/api', changeOrigin: true },
        },
    },

    vite: {
        optimizeDeps: {
            include: ['@tanstack/vue-query'],
        },
        resolve: {
            dedupe: ['@tanstack/vue-query', 'vue'],
        },
    },

    css: ['~/assets/css/main.css'],

    fonts: {
        families: [
            { name: 'Plus Jakarta Sans', provider: 'google', weights: [500, 600, 700, 800] },
            { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
            { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] },
        ],
    },

    vuetify: {
        vuetifyOptions: {
            icons: { defaultSet: 'mdi' },
            theme: {
                defaultTheme: 'light',
                themes: {
                    light: {
                        dark: false,
                        colors: {
                            primary: '#0F766E',
                            secondary: '#3B82F6',
                            accent: '#F59E0B',
                            success: '#22C55E',
                            warning: '#F97316',
                            error: '#EF4444',
                            background: '#F8FAFC',
                            surface: '#FFFFFF',
                            'on-background': '#0F172A',
                            'on-surface': '#0F172A',
                        },
                    },
                    dark: {
                        dark: true,
                        colors: {
                            primary: '#14B8A6',
                            secondary: '#60A5FA',
                            accent: '#FBBF24',
                            success: '#4ADE80',
                            warning: '#FB923C',
                            error: '#F87171',
                            background: '#0F172A',
                            surface: '#1E293B',
                            'on-background': '#F1F5F9',
                            'on-surface': '#F1F5F9',
                        },
                    },
                },
            },
            defaults: {
                VBtn: { rounded: 'lg', class: 'text-none font-medium', height: 44 },
                VCard: { rounded: 'xl', elevation: 2 },
                VTextField: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VSelect: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VTextarea: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VAutocomplete: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VCombobox: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VFileInput: { variant: 'outlined', rounded: 'lg', color: 'primary' },
                VAlert: { rounded: 'lg' },
                VSwitch: { color: 'primary', inset: true },
                VTabs: { color: 'primary' },
                VProgressLinear: { rounded: true },
                VMenu: { transition: 'slide-y-transition' },
                VDialog: { transition: 'dialog-bottom-transition' },
                VTooltip: { location: 'top' },
            },
        },
    },
})
