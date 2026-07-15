import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Booking } from '~/types/mentorship'

export function useMyBookings() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['sessions', 'mentee'],
        queryFn: async (): Promise<Booking[]> => (await $api.get('/api/v1/bookings')).data.data,
        refetchInterval: 30_000, // poll — a reschedule/cancel by the other party shows up
    })
}

export function useMentorBookings() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['sessions', 'mentor'],
        queryFn: async (): Promise<Booking[]> => (await $api.get('/api/v1/mentor/bookings')).data.data,
        refetchInterval: 30_000,
    })
}

export function useSessionActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['sessions'] })

    return {
        cancel: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/bookings/${id}/cancel`),
            onSuccess: invalidate,
        }),
        reschedule: useMutation({
            mutationFn: (p: { id: string; starts_at: string }) => $api.post(`/api/v1/bookings/${p.id}/reschedule`, { starts_at: p.starts_at }),
            onSuccess: invalidate,
        }),
        rate: useMutation({
            mutationFn: (p: { id: string; stars: number; comment: string | null }) =>
                $api.post(`/api/v1/bookings/${p.id}/rating`, { stars: p.stars, comment: p.comment }),
            onSuccess: invalidate,
        }),
    }
}

export function useSessionNotes(bookingId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['session-notes', bookingId.value]),
        queryFn: async (): Promise<{ body: string } | null> =>
            (await $api.get(`/api/v1/bookings/${bookingId.value}/notes`)).data.data,
        enabled: computed(() => Boolean(bookingId.value)),
    })
}

export function useSaveNotes(bookingId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: string) => $api.put(`/api/v1/bookings/${bookingId}/notes`, { body }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session-notes', bookingId] }),
    })
}

/** Download the booking's .ics through the authenticated API and trigger a save. */
export async function downloadCalendar(bookingId: string): Promise<void> {
    const { $api } = useNuxtApp()
    const response = await $api.get(`/api/v1/bookings/${bookingId}/calendar`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lumen-session-${bookingId}.ics`
    link.click()
    URL.revokeObjectURL(url)
}
