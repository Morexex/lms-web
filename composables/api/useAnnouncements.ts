import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Announcement } from '~/types/messaging'

export function useAnnouncements() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['announcements', institution.activeSlug]),
        queryFn: async (): Promise<Announcement[]> =>
            (await $api.get('/api/v1/institution/announcements')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useAnnounceInstitution() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: { title: string; body: string }) =>
            $api.post('/api/v1/institution/announcements', payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['announcements'] }),
    })
}

export function useAnnounceCourse(courseId: string) {
    const { $api } = useNuxtApp()

    return useMutation({
        mutationFn: (payload: { title: string; body: string }) =>
            $api.post(`/api/v1/institution/courses/${courseId}/announcements`, payload),
    })
}
