import { useQuery } from '@tanstack/vue-query'
import type { Certificate, VerificationResult } from '~/types/certification'

export function useMyCertificates() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'certificates']),
        queryFn: async (): Promise<Certificate[]> => (await $api.get('/api/v1/institution/certificates')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}

/** Public — works without login (the verify route needs no auth or tenancy). */
export function useVerifyCertificate(code: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['verify', code],
        queryFn: async (): Promise<VerificationResult> => (await $api.get(`/api/v1/verify/${code}`)).data.data,
        retry: false,
    })
}
