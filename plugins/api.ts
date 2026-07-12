import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password']

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const api = axios.create({
        baseURL: import.meta.server ? config.public.apiBaseServer : config.public.apiBaseClient,
        withCredentials: true, // send/receive the refresh cookie — the M6 backend trap
        headers: { Accept: 'application/json' },
    })

    api.interceptors.request.use((cfg) => {
        if (import.meta.client) {
            const auth = useAuthStore()
            if (auth.accessToken) {
                cfg.headers.Authorization = `Bearer ${auth.accessToken}`
            }
        }

        return cfg
    })

    let refreshing: Promise<void> | null = null

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const original = error.config as RetriableConfig | undefined

            const shouldTryRefresh =
                import.meta.client &&
                error.response?.status === 401 &&
                original !== undefined &&
                original._retry !== true &&
                !SKIP_REFRESH.some((path) => original.url?.includes(path))

            if (!shouldTryRefresh || !original) {
                return Promise.reject(error)
            }

            const auth = useAuthStore()
            original._retry = true

            try {
                refreshing ??= auth.refresh().finally(() => {
                    refreshing = null
                })
                await refreshing

                original.headers.Authorization = `Bearer ${auth.accessToken}`

                return api(original)
            } catch (refreshError) {
                auth.clear()

                return Promise.reject(refreshError)
            }
        },
    )

    return { provide: { api } }
})
