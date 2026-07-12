import { useQuery } from '@tanstack/vue-query'
import type { Member } from '~/types/institution'

export function useMembers() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        // Slug in the key: switching tenants fetches fresh, never serves stale.
        queryKey: computed(() => ['institution', institution.activeSlug, 'members']),
        queryFn: async (): Promise<Member[]> => (await $api.get('/api/v1/institution/members')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}
