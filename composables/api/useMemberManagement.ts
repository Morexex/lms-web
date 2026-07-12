import { useMutation, useQueryClient } from '@tanstack/vue-query'

function membersKey() {
    const institution = useInstitutionStore()
    return computed(() => ['institution', institution.activeSlug, 'members'])
}

export function useChangeMemberRole() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = membersKey()

    return useMutation({
        mutationFn: async (payload: { id: string; role: string }) =>
            $api.patch(`/api/v1/institution/members/${payload.id}`, { role: payload.role }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useSuspendMember() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = membersKey()

    return useMutation({
        mutationFn: async (id: string) => $api.post(`/api/v1/institution/members/${id}/suspend`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useReactivateMember() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = membersKey()

    return useMutation({
        mutationFn: async (id: string) => $api.post(`/api/v1/institution/members/${id}/reactivate`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useRemoveMember() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = membersKey()

    return useMutation({
        mutationFn: async (id: string) => $api.delete(`/api/v1/institution/members/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}
