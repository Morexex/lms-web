import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'

export interface PlatformUser {
    id: string
    name: string
    email: string
    status: string
    is_minor: boolean
    email_verified: boolean
    created_at: string | null
}

interface ImpersonationPayload {
    access_token: string
    user: PlatformUser
    impersonator: { id: string; name: string }
}

export function usePlatformUsers(search: Ref<string>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['platform', 'users', search.value]),
        queryFn: async (): Promise<PlatformUser[]> =>
            (await $api.get('/api/v1/platform/users', { params: { q: search.value } })).data.data,
    })
}

export function useSuspendUser() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => $api.post(`/api/v1/platform/users/${id}/suspend`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platform', 'users'] }),
    })
}

export function useReactivateUser() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => $api.post(`/api/v1/platform/users/${id}/reactivate`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platform', 'users'] }),
    })
}

export function useImpersonateUser() {
    const { $api } = useNuxtApp()

    return useMutation({
        mutationFn: async (id: string): Promise<ImpersonationPayload> =>
            (await $api.post(`/api/v1/platform/users/${id}/impersonate`)).data.data,
    })
}
