import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Lesson } from '~/types/learning'

export function useLesson(lessonId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: async (): Promise<Lesson> => (await $api.get(`/api/v1/institution/lessons/${lessonId}`)).data.data,
    })
}

export function useBlockActions(lessonId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] })

    return {
        create: useMutation({
            mutationFn: (p: { type: string; content: Record<string, unknown> }) =>
                $api.post(`/api/v1/institution/lessons/${lessonId}/blocks`, p),
            onSuccess,
        }),
        update: useMutation({
            mutationFn: (p: { id: string; content: Record<string, unknown> }) =>
                $api.patch(`/api/v1/institution/blocks/${p.id}`, { content: p.content }),
            onSuccess,
        }),
        remove: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/blocks/${id}`),
            onSuccess,
        }),
    }
}
