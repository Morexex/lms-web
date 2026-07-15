import { useMutation } from '@tanstack/vue-query'
import type { MediaItem } from '~/types/media'

export function useUploadMedia() {
    const { $api } = useNuxtApp()

    return useMutation({
        // Axios sets the multipart boundary automatically for FormData; the
        // request interceptor still attaches auth + the X-Institution header.
        mutationFn: async (file: File): Promise<MediaItem> => {
            const form = new FormData()
            form.append('file', file)
            return (await $api.post('/api/v1/institution/media', form)).data.data
        },
    })
}
