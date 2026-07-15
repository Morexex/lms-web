import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { ConversationSummary, Message } from '~/types/messaging'

export function useConversations() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['conversations', institution.activeSlug]),
        queryFn: async (): Promise<ConversationSummary[]> =>
            (await $api.get('/api/v1/institution/conversations')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
        refetchInterval: 20_000, // poll for new activity
    })
}

export function useConversationMessages(conversationId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['conversation', conversationId.value, 'messages']),
        queryFn: async (): Promise<Message[]> =>
            (await $api.get(`/api/v1/institution/conversations/${conversationId.value}/messages`)).data.data,
        enabled: computed(() => Boolean(conversationId.value)),
        refetchInterval: 10_000,
    })
}

export function useStartConversation() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { user_id: string; body?: string }): Promise<ConversationSummary> =>
            (await $api.post('/api/v1/institution/conversations', payload)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
    })
}

export function useSendMessage(conversationId: Ref<string | null>) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: string) =>
            $api.post(`/api/v1/institution/conversations/${conversationId.value}/messages`, { body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversation', conversationId.value, 'messages'] })
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        },
    })
}
