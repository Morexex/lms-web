import { useQuery } from '@tanstack/vue-query'
import type { FeatureMap } from '~/types/platform'

/**
 * The effective feature-flag map for the current user, so the SPA can gate its
 * UI. Unknown/absent flags default to enabled — a flag only hides a feature
 * once a super admin has explicitly turned it off.
 */
export function useFeatures() {
    const { $api } = useNuxtApp()
    const auth = useAuthStore()

    const query = useQuery({
        queryKey: ['features'],
        queryFn: async (): Promise<FeatureMap> => (await $api.get('/api/v1/features')).data.data,
        enabled: computed(() => auth.isAuthenticated),
        staleTime: 5 * 60 * 1000,
    })

    function isEnabled(key: string): boolean {
        return query.data.value?.[key] ?? true
    }

    return { ...query, isEnabled }
}
