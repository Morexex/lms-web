import axios from 'axios'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: config.public.apiBase,
        headers: { Accept: 'application/json' },
    })

    // Interceptors for auth tokens (M6) and X-Institution tenancy (M8) attach here.

    return { provide: { api } }
})
