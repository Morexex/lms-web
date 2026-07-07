import { useQuery } from '@tanstack/vue-query'
import type { ApiEnvelope } from '~/types/api'

export interface PlatformStatus {
    service: string
    version: string
    status: string
}

export const usePlatformStatus = () => {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: queryKeys.platform.status,
        queryFn: async () => {
            const response = await $api.get<ApiEnvelope<PlatformStatus>>('/api/v1/platform/status')

            return response.data.data
        },
    })
}
