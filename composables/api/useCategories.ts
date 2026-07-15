import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Category } from '~/types/catalog'

function categoriesKey() {
    const institution = useInstitutionStore()
    return computed(() => ['institution', institution.activeSlug, 'categories'])
}

export function useCategories() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: categoriesKey(),
        queryFn: async (): Promise<Category[]> => (await $api.get('/api/v1/institution/categories')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useCreateCategory() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = categoriesKey()

    return useMutation({
        mutationFn: async (name: string): Promise<Category> =>
            (await $api.post('/api/v1/institution/categories', { name })).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useDeleteCategory() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = categoriesKey()

    return useMutation({
        mutationFn: async (id: string) => $api.delete(`/api/v1/institution/categories/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}
