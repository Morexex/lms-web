import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AuthUser } from '~/types/auth'

export function useUpdateProfile() {
    const { $api } = useNuxtApp()
    const auth = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { name?: string; bio?: string; timezone?: string }): Promise<AuthUser> =>
            (await $api.patch('/api/v1/profile', payload)).data.data,
        onSuccess: (updated) => {
            auth.user = updated
            queryClient.invalidateQueries({ queryKey: ['institutions', 'mine'] })
        },
    })
}
