import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Attendee, LiveSession } from '~/types/live-sessions'

// --- Tutor (scheduling) ---

export function useCourseLiveSessions(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'live-sessions'],
        queryFn: async (): Promise<LiveSession[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/live-sessions`)).data.data,
    })
}

export function useLiveSessionActions(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['course', courseId, 'live-sessions'] })

    return {
        create: useMutation({
            mutationFn: (data: Partial<LiveSession>) =>
                $api.post(`/api/v1/institution/courses/${courseId}/live-sessions`, data),
            onSuccess: invalidate,
        }),
        update: useMutation({
            mutationFn: (p: { id: string; data: Partial<LiveSession> }) =>
                $api.patch(`/api/v1/institution/live-sessions/${p.id}`, p.data),
            onSuccess: invalidate,
        }),
        remove: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/live-sessions/${id}`),
            onSuccess: invalidate,
        }),
    }
}

export function useAttendees(sessionId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['live-session', sessionId.value, 'attendees']),
        queryFn: async (): Promise<Attendee[]> =>
            (await $api.get(`/api/v1/institution/live-sessions/${sessionId.value}/attendees`)).data.data,
        enabled: computed(() => Boolean(sessionId.value)),
    })
}

// --- Student ---

export function useUpcomingSessions() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['live-sessions', 'upcoming', institution.activeSlug]),
        queryFn: async (): Promise<LiveSession[]> =>
            (await $api.get('/api/v1/institution/live-sessions/upcoming')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useJoinSession() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string): Promise<{ join_url: string }> =>
            (await $api.post(`/api/v1/institution/live-sessions/${id}/join`)).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['live-sessions', 'upcoming'] }),
    })
}
