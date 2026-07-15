import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Course } from '~/types/catalog'

function coursesKey() {
    const institution = useInstitutionStore()
    return computed(() => ['institution', institution.activeSlug, 'courses'])
}

export function useCourses(status?: Ref<string>) {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'courses', 'list', status?.value ?? '']),
        queryFn: async (): Promise<Course[]> =>
            (await $api.get('/api/v1/institution/courses', { params: { status: status?.value || undefined } })).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useCourse(id: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['institution', 'course', id],
        queryFn: async (): Promise<Course> => (await $api.get(`/api/v1/institution/courses/${id}`)).data.data,
    })
}

export function useSaveCourse() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = coursesKey()

    return useMutation({
        mutationFn: async (payload: { id?: string; data: Record<string, unknown> }): Promise<Course> => {
            if (payload.id) {
                return (await $api.patch(`/api/v1/institution/courses/${payload.id}`, payload.data)).data.data
            }
            return (await $api.post('/api/v1/institution/courses', payload.data)).data.data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}

export function useCourseStatus() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const key = coursesKey()

    return useMutation({
        mutationFn: async (payload: { id: string; action: 'publish' | 'unpublish' | 'archive' }) =>
            $api.post(`/api/v1/institution/courses/${payload.id}/${payload.action}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key.value }),
    })
}
