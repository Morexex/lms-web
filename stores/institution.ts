import { defineStore } from 'pinia'

export const useInstitutionStore = defineStore('institution', () => {
    // Persisted so the active tenant survives a refresh.
    const activeSlug = useCookie<string | null>('lumen-institution', {
        default: () => null,
        maxAge: 60 * 60 * 24 * 365,
    })

    function setActive(slug: string | null): void {
        activeSlug.value = slug
    }

    return { activeSlug, setActive }
})
