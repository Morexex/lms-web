import { useQuery } from '@tanstack/vue-query'
import type { AdminOrder, RevenueSummary } from '~/types/billing'

export function useRevenue() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'revenue']),
        queryFn: async (): Promise<RevenueSummary> => (await $api.get('/api/v1/institution/revenue')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

export function useInstitutionOrders() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'admin-orders']),
        queryFn: async (): Promise<AdminOrder[]> => (await $api.get('/api/v1/institution/orders')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}
