import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Thread } from '~/types/community'

export function useThreads(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'threads'],
        queryFn: async (): Promise<Thread[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/threads`)).data.data,
    })
}

export function useThread(threadId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['thread', threadId.value]),
        queryFn: async (): Promise<Thread> => (await $api.get(`/api/v1/institution/threads/${threadId.value}`)).data.data,
        enabled: computed(() => Boolean(threadId.value)),
    })
}

export function useDiscussionActions(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['course', courseId, 'threads'] })
        queryClient.invalidateQueries({ queryKey: ['thread'] })
    }

    return {
        createThread: useMutation({
            mutationFn: async (data: { title: string; body: string; mentions: string[] }): Promise<Thread> =>
                (await $api.post(`/api/v1/institution/courses/${courseId}/threads`, data)).data.data,
            onSuccess: refresh,
        }),
        reply: useMutation({
            mutationFn: (p: { threadId: string; body: string; mentions: string[] }) =>
                $api.post(`/api/v1/institution/threads/${p.threadId}/replies`, { body: p.body, mentions: p.mentions }),
            onSuccess: refresh,
        }),
        reactThread: useMutation({
            mutationFn: (p: { id: string; emoji: string }) =>
                $api.post(`/api/v1/institution/threads/${p.id}/reactions`, { emoji: p.emoji }),
            onSuccess: refresh,
        }),
        reactReply: useMutation({
            mutationFn: (p: { id: string; emoji: string }) =>
                $api.post(`/api/v1/institution/replies/${p.id}/reactions`, { emoji: p.emoji }),
            onSuccess: refresh,
        }),
        moderateThread: useMutation({
            mutationFn: (p: { id: string; data: Record<string, boolean> }) =>
                $api.patch(`/api/v1/institution/threads/${p.id}/moderation`, p.data),
            onSuccess: refresh,
        }),
        removeThread: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/threads/${id}`),
            onSuccess: refresh,
        }),
        moderateReply: useMutation({
            mutationFn: (p: { id: string; is_hidden: boolean }) =>
                $api.patch(`/api/v1/institution/replies/${p.id}/moderation`, { is_hidden: p.is_hidden }),
            onSuccess: refresh,
        }),
        removeReply: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/replies/${id}`),
            onSuccess: refresh,
        }),
    }
}
