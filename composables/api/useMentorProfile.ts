import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MentorProfile, MentorService } from '~/types/mentorship'

export function useMyMentorProfile() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['mentor', 'profile'],
        queryFn: async (): Promise<MentorProfile | null> => (await $api.get('/api/v1/mentor/profile')).data.data,
    })
}

export function useMentorProfileActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['mentor', 'profile'] })

    return {
        upsert: useMutation({
            mutationFn: (data: Partial<MentorProfile>) => $api.put('/api/v1/mentor/profile', data),
            onSuccess: invalidate,
        }),
        createService: useMutation({
            mutationFn: (data: Partial<MentorService>) => $api.post('/api/v1/mentor/services', data),
            onSuccess: invalidate,
        }),
        deleteService: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/mentor/services/${id}`),
            onSuccess: invalidate,
        }),
        addAvailability: useMutation({
            mutationFn: (data: { day_of_week: number; start_time: string; end_time: string }) =>
                $api.post('/api/v1/mentor/availability', data),
            onSuccess: invalidate,
        }),
        removeAvailability: useMutation({
            mutationFn: (id: number) => $api.delete(`/api/v1/mentor/availability/${id}`),
            onSuccess: invalidate,
        }),
    }
}
