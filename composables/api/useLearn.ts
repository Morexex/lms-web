import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Curriculum, Lesson } from '~/types/learning'

export function useLearnCurriculum(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['learn', courseId],
        queryFn: async (): Promise<Curriculum> => (await $api.get(`/api/v1/institution/learn/${courseId}`)).data.data,
    })
}

export function useLearnLesson(courseId: string, lessonId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['learn', courseId, 'lesson', lessonId.value]),
        queryFn: async (): Promise<Lesson> =>
            (await $api.get(`/api/v1/institution/learn/${courseId}/lessons/${lessonId.value}`)).data.data,
        enabled: computed(() => Boolean(lessonId.value)),
        retry: false, // a 403 (locked lesson) should not retry
    })
}
