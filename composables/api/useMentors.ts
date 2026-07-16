import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Booking, MentorProfile, Slot } from '~/types/mentorship'

export function useMentors() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['mentors'],
        queryFn: async (): Promise<MentorProfile[]> => (await $api.get('/api/v1/mentors')).data.data,
    })
}

export function useMentor(profileId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['mentors', profileId],
        queryFn: async (): Promise<MentorProfile> => (await $api.get(`/api/v1/mentors/${profileId}`)).data.data,
    })
}

export function useMentorSlots(profileId: string, serviceId: Ref<string | null>, timezone: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['slots', profileId, serviceId.value, timezone]),
        queryFn: async (): Promise<Slot[]> =>
            (await $api.get(`/api/v1/mentors/${profileId}/services/${serviceId.value}/slots`, { params: { tz: timezone } })).data.data,
        enabled: computed(() => Boolean(serviceId.value)),
    })
}

export interface BookingResult {
    // Free bookings return the Booking directly; paid ones wrap it with a checkout.
    booking?: Booking
    checkout?: { order_id: string; redirect_url: string | null; instructions: string | null } | null
    status?: string
    id?: string
}

export function useBookSession(profileId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { service_id: string; starts_at: string; mentee_timezone: string }): Promise<BookingResult> =>
            (await $api.post(`/api/v1/mentors/${profileId}/bookings`, payload, {
                headers: { 'Idempotency-Key': crypto.randomUUID() },
            })).data.data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['slots', profileId] })
        },
    })
}
