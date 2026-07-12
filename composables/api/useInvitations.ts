import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Invitation } from '~/types/institution'

function invitationsKey() {
    const institution = useInstitutionStore()
    return computed(() => ['institution', institution.activeSlug, 'invitations'])
}

export function useInvitations() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: invitationsKey(),
        queryFn: async (): Promise<Invitation[]> => (await $api.get('/api/v1/institution/invitations')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useInviteMember() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = invitationsKey()

    return useMutation({
        mutationFn: async (payload: { email: string; role: string }): Promise<Invitation> =>
            (await $api.post('/api/v1/institution/invitations', payload)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useBulkInvite() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = invitationsKey()

    return useMutation({
        mutationFn: async (payload: { role: string; emails: string[] }) =>
            (await $api.post('/api/v1/institution/invitations/bulk', payload)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useRevokeInvitation() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = invitationsKey()

    return useMutation({
        mutationFn: async (id: string) => $api.delete(`/api/v1/institution/invitations/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useInvitationPreview(token: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['invitation', token],
        queryFn: async () => (await $api.get(`/api/v1/invitations/${token}`)).data.data,
        retry: false,
    })
}

export function useAcceptInvitation() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (token: string) => (await $api.post('/api/v1/invitations/accept', { token })).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institutions', 'mine'] }),
    })
}
