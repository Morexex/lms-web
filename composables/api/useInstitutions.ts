import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Institution, Membership } from '~/types/institution'

export function useMyInstitutions() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['institutions', 'mine'],
        queryFn: async (): Promise<Membership[]> => (await $api.get('/api/v1/institutions')).data.data,
    })
}

export function useCreateInstitution() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { name: string; primary_color?: string }): Promise<Institution> =>
            (await $api.post('/api/v1/institutions', payload)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutions', 'mine'] }),
    })
}
