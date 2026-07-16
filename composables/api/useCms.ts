import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { CmsContent, CmsContentType, MenuItem, PublicMenu, PublicPostSummary } from '~/types/cms'

// --- Authoring (institution admins) ---

export function useCmsContents(type: Ref<CmsContentType>) {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'cms', type.value]),
        queryFn: async (): Promise<CmsContent[]> =>
            (await $api.get('/api/v1/institution/cms/contents', { params: { type: type.value } })).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
        retry: false,
    })
}

export function useCmsActions() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['institution'] })

    return {
        create: useMutation({
            mutationFn: async (data: Partial<CmsContent>): Promise<CmsContent> =>
                (await $api.post('/api/v1/institution/cms/contents', data)).data.data,
            onSuccess: invalidate,
        }),
        update: useMutation({
            mutationFn: (p: { id: string; data: Partial<CmsContent> }) =>
                $api.patch(`/api/v1/institution/cms/contents/${p.id}`, p.data),
            onSuccess: invalidate,
        }),
        remove: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/cms/contents/${id}`),
            onSuccess: invalidate,
        }),
        publish: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/institution/cms/contents/${id}/publish`),
            onSuccess: invalidate,
        }),
        unpublish: useMutation({
            mutationFn: (id: string) => $api.post(`/api/v1/institution/cms/contents/${id}/unpublish`),
            onSuccess: invalidate,
        }),
    }
}

export function useCmsMenu() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['institution', institution.activeSlug, 'cms-menu']),
        queryFn: async (): Promise<MenuItem[]> => (await $api.get('/api/v1/institution/cms/menu')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
        retry: false,
    })
}

export function useSaveCmsMenu() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (items: MenuItem[]) => $api.put('/api/v1/institution/cms/menu', { items }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['institution'] }),
    })
}

// --- Public site (no auth) ---

export function usePublicPage(institutionSlug: string, slug: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['public-site', institutionSlug, 'page', slug],
        queryFn: async (): Promise<CmsContent> =>
            (await $api.get(`/api/v1/public/sites/${institutionSlug}/pages/${slug}`)).data.data,
        retry: false,
    })
}

export function usePublicPosts(institutionSlug: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['public-site', institutionSlug, 'posts'],
        queryFn: async (): Promise<PublicPostSummary[]> =>
            (await $api.get(`/api/v1/public/sites/${institutionSlug}/posts`)).data.data,
        retry: false,
    })
}

export function usePublicPost(institutionSlug: string, slug: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['public-site', institutionSlug, 'post', slug],
        queryFn: async (): Promise<CmsContent> =>
            (await $api.get(`/api/v1/public/sites/${institutionSlug}/posts/${slug}`)).data.data,
        retry: false,
    })
}

export function usePublicMenu(institutionSlug: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['public-site', institutionSlug, 'menu'],
        queryFn: async (): Promise<PublicMenu> =>
            (await $api.get(`/api/v1/public/sites/${institutionSlug}/menu`)).data.data,
        retry: false,
    })
}
