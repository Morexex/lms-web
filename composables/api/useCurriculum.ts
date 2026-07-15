import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Section } from '~/types/learning'

export function useCurriculum(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'curriculum'],
        queryFn: async (): Promise<Section[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/sections`)).data.data,
    })
}

export function useCurriculumActions(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['course', courseId, 'curriculum'] })

    return {
        createSection: useMutation({
            mutationFn: (title: string) => $api.post(`/api/v1/institution/courses/${courseId}/sections`, { title }),
            onSuccess,
        }),
        updateSection: useMutation({
            mutationFn: (p: { id: string; title: string }) => $api.patch(`/api/v1/institution/sections/${p.id}`, { title: p.title }),
            onSuccess,
        }),
        deleteSection: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/sections/${id}`),
            onSuccess,
        }),
        reorderSections: useMutation({
            mutationFn: (ids: string[]) => $api.post(`/api/v1/institution/courses/${courseId}/sections/reorder`, { ids }),
            onSuccess,
        }),
        createLesson: useMutation({
            mutationFn: (p: { sectionId: string; title: string; is_preview: boolean }) =>
                $api.post(`/api/v1/institution/sections/${p.sectionId}/lessons`, { title: p.title, is_preview: p.is_preview }),
            onSuccess,
        }),
        updateLesson: useMutation({
            mutationFn: (p: { id: string; title?: string; is_preview?: boolean }) =>
                $api.patch(`/api/v1/institution/lessons/${p.id}`, { title: p.title, is_preview: p.is_preview }),
            onSuccess,
        }),
        deleteLesson: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/lessons/${id}`),
            onSuccess,
        }),
        reorderLessons: useMutation({
            mutationFn: (p: { sectionId: string; ids: string[] }) =>
                $api.post(`/api/v1/institution/sections/${p.sectionId}/lessons/reorder`, { ids: p.ids }),
            onSuccess,
        }),
    }
}
