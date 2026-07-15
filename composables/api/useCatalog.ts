import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Course } from '~/types/catalog'

export function useCatalog(filters: { q: Ref<string>; level: Ref<string> }) {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'catalog', filters.q.value, filters.level.value]),
        queryFn: async (): Promise<Course[]> =>
            (
                await $api.get('/api/v1/institution/catalog', {
                    params: { q: filters.q.value || undefined, level: filters.level.value || undefined },
                })
            ).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useCatalogCourse(id: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['catalog', 'course', id],
        queryFn: async (): Promise<Course> => (await $api.get(`/api/v1/institution/catalog/${id}`)).data.data,
        retry: false,
    })
}
