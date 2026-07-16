import { useQuery } from '@tanstack/vue-query'
import type { AnalyticsDashboard, CourseAnalytics, CourseEngagement } from '~/types/analytics'

export function useAnalyticsDashboard() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'analytics', 'dashboard']),
        queryFn: async (): Promise<AnalyticsDashboard> =>
            (await $api.get('/api/v1/institution/analytics/dashboard')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
        retry: false, // a 403 (non-admin) should not retry
    })
}

export function useCourseEngagement() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'analytics', 'courses']),
        queryFn: async (): Promise<CourseEngagement[]> =>
            (await $api.get('/api/v1/institution/analytics/courses')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
        retry: false,
    })
}

export function useCourseAnalytics(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['analytics', 'course', courseId],
        queryFn: async (): Promise<CourseAnalytics> =>
            (await $api.get(`/api/v1/institution/analytics/courses/${courseId}`)).data.data,
        retry: false,
    })
}

/** Download a CSV report through the authenticated API and trigger a save. */
export async function downloadReport(report: 'courses' | 'revenue'): Promise<void> {
    const { $api } = useNuxtApp()
    const response = await $api.get(`/api/v1/institution/analytics/export/${report}`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
}
