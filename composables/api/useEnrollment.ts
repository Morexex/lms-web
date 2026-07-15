import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Enrollment } from '~/types/learning'

export function useMyEnrollments() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'enrollments']),
        queryFn: async (): Promise<Enrollment[]> => (await $api.get('/api/v1/institution/enrollments')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useEnroll() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const institution = useInstitutionStore()

    return useMutation({
        mutationFn: async (courseId: string): Promise<Enrollment> =>
            (await $api.post(`/api/v1/institution/courses/${courseId}/enroll`)).data.data,
        onSuccess: (_, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['institution', institution.activeSlug, 'enrollments'] })
            queryClient.invalidateQueries({ queryKey: ['learn', courseId] })
        },
    })
}
