import { useTheme } from 'vuetify'

type ThemeName = 'light' | 'dark'

export const useAppTheme = () => {
    const preference = useCookie<ThemeName>('lumen-theme', {
        default: () => 'light',
        maxAge: 60 * 60 * 24 * 365,
    })

    const vuetifyTheme = useTheme()

    const apply = (name: ThemeName) => {
        preference.value = name
        vuetifyTheme.global.name.value = name
    }

    const toggle = () => apply(preference.value === 'dark' ? 'light' : 'dark')

    const isDark = computed(() => preference.value === 'dark')

    return { preference, isDark, toggle, apply }
}
