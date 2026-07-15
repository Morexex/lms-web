import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { ConnectionUser, Milestone, NetworkProfile, NetworkSkill, PendingRequest } from '~/types/network'

export function useMyNetworkProfile() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['network', 'profile'],
        queryFn: async (): Promise<NetworkProfile | null> => (await $api.get('/api/v1/network/profile')).data.data,
    })
}

export function useUserProfile(userId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['network', 'user', userId],
        queryFn: async (): Promise<NetworkProfile> => (await $api.get(`/api/v1/network/users/${userId}/profile`)).data.data,
    })
}

export function useConnections() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['network', 'connections'],
        queryFn: async (): Promise<ConnectionUser[]> => (await $api.get('/api/v1/network/connections')).data.data,
    })
}

export function usePendingConnections() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['network', 'pending'],
        queryFn: async (): Promise<PendingRequest[]> => (await $api.get('/api/v1/network/connections/pending')).data.data,
    })
}

export function useFeed() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['network', 'feed'],
        queryFn: async (): Promise<Milestone[]> => (await $api.get('/api/v1/network/feed')).data.data,
    })
}

export function useNetworkProfileActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['network', 'profile'] })

    return {
        upsert: useMutation({
            mutationFn: (data: Partial<NetworkProfile>) => $api.put('/api/v1/network/profile', data),
            onSuccess: invalidate,
        }),
        addSkill: useMutation({
            mutationFn: (name: string) => $api.post('/api/v1/network/profile/skills', { name }),
            onSuccess: invalidate,
        }),
        removeSkill: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/network/skills/${id}`),
            onSuccess: invalidate,
        }),
    }
}

export function useConnectionActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['network'] })

    return {
        connect: useMutation({
            mutationFn: (userId: string) => $api.post(`/api/v1/network/users/${userId}/connect`),
            onSuccess: invalidate,
        }),
        accept: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/network/connections/${id}/accept`),
            onSuccess: invalidate,
        }),
        decline: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/network/connections/${id}/decline`),
            onSuccess: invalidate,
        }),
    }
}

export function useEndorse() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (skill: NetworkSkill): Promise<{ endorsement_count: number; endorsed: boolean }> =>
            (await $api.post(`/api/v1/network/skills/${skill.id}/endorse`)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['network', 'user'] }),
    })
}
