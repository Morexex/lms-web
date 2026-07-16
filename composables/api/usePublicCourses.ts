import { useQuery } from '@tanstack/vue-query'

export interface PublicCourse {
    title: string
    summary: string | null
    level: string
    is_free: boolean
    price_amount: number | null
    price_currency: string | null
    category: string | null
    institution: string | null
}

export interface PublicCatalog {
    courses: PublicCourse[]
    stats: { courses: number; institutions: number; learners: number }
}

/** The public shop window for the landing page — no auth required. */
export function usePublicCourses() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['public', 'courses'],
        queryFn: async (): Promise<PublicCatalog> => (await $api.get('/api/v1/public/courses')).data.data,
        staleTime: 5 * 60 * 1000,
        retry: false,
    })
}
