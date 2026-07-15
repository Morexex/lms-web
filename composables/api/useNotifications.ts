import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { AppNotification, NotificationPreference } from '~/types/messaging'

export function useNotifications() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['notifications'],
        queryFn: async (): Promise<AppNotification[]> => (await $api.get('/api/v1/notifications')).data.data,
    })
}

export function useUnreadCount() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        // Poll — real-time delivery is an enhancement layer added in M32.
        queryFn: async (): Promise<number> => (await $api.get('/api/v1/notifications/unread-count')).data.data.count,
        refetchInterval: 30_000,
    })
}

export function useNotificationActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] })

    return {
        markRead: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/notifications/${id}/read`),
            onSuccess: invalidate,
        }),
        markAllRead: useMutation({
            mutationFn: () => $api.post('/api/v1/notifications/read-all'),
            onSuccess: invalidate,
        }),
    }
}

export function usePreferences() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['notifications', 'preferences'],
        queryFn: async (): Promise<NotificationPreference[]> =>
            (await $api.get('/api/v1/notifications/preferences')).data.data,
    })
}

export function useUpdatePreferences() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (preferences: Array<{ category: string; in_app: boolean; email: boolean }>) =>
            $api.patch('/api/v1/notifications/preferences', { preferences }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] }),
    })
}
