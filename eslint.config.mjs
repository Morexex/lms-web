import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
    rules: {
        'vue/multi-word-component-names': 'off',
        // Optionality is expressed via TypeScript's `?` in defineProps, so a
        // separate Vue default is redundant noise in a TS-first codebase.
        'vue/require-default-prop': 'off',
    },
})
