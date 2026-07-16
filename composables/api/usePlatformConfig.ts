import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { AuditLogPage, FeatureFlag, PlatformSettings } from '~/types/platform'

export function usePlatformSettings() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['platform', 'settings'],
        queryFn: async (): Promise<PlatformSettings> => (await $api.get('/api/v1/platform/settings')).data.data,
        retry: false,
    })
}

export function useSavePlatformSettings() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: { platform_fee_percent: number; default_gateway: string }) =>
            $api.put('/api/v1/platform/settings', data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platform', 'settings'] }),
    })
}

export function useFeatureFlags() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['platform', 'feature-flags'],
        queryFn: async (): Promise<FeatureFlag[]> => (await $api.get('/api/v1/platform/feature-flags')).data.data,
        retry: false,
    })
}

export function useToggleFeatureFlag() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (p: { key: string; enabled: boolean }) => $api.put('/api/v1/platform/feature-flags', p),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform', 'feature-flags'] })
            queryClient.invalidateQueries({ queryKey: ['features'] })
        },
    })
}

export function useAuditLogs(filters: Ref<{ action: string; page: number }>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['platform', 'audit-logs', filters.value.action, filters.value.page]),
        queryFn: async (): Promise<AuditLogPage> =>
            (await $api.get('/api/v1/platform/audit-logs', {
                params: { action: filters.value.action || undefined, page: filters.value.page },
            })).data.data,
        retry: false,
    })
}
