import { defineStore } from 'pinia'
import type { AuthUser, SessionPayload } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)
    const ready = ref(false) // has a session-restore attempt completed?

    const isAuthenticated = computed(() => user.value !== null)
    const isVerified = computed(() => user.value?.email_verified === true)

    function setSession(payload: SessionPayload): void {
        accessToken.value = payload.access_token
        user.value = payload.user
    }

    function clear(): void {
        accessToken.value = null
        user.value = null
    }

    async function login(email: string, password: string): Promise<void> {
        const { data } = await useNuxtApp().$api.post<{ data: SessionPayload }>('/api/v1/auth/login', { email, password })
        setSession(data.data)
    }

    async function register(payload: {
        name: string
        email: string
        password: string
        password_confirmation: string
    }): Promise<void> {
        const { data } = await useNuxtApp().$api.post<{ data: SessionPayload }>('/api/v1/auth/register', payload)
        setSession(data.data)
    }

    async function refresh(): Promise<void> {
        const { data } = await useNuxtApp().$api.post<{ data: SessionPayload }>('/api/v1/auth/refresh')
        setSession(data.data)
    }

    async function logout(): Promise<void> {
        try {
            await useNuxtApp().$api.post('/api/v1/auth/logout')
        } finally {
            clear()
        }
    }

    async function forgotPassword(email: string): Promise<string> {
        const { data } = await useNuxtApp().$api.post<{ data: { message: string } }>('/api/v1/auth/forgot-password', { email })
        return data.data.message
    }

    async function resetPassword(payload: {
        token: string
        email: string
        password: string
        password_confirmation: string
    }): Promise<void> {
        await useNuxtApp().$api.post('/api/v1/auth/reset-password', payload)
    }

    async function resendVerification(): Promise<void> {
        await useNuxtApp().$api.post('/api/v1/auth/email/verification-notification')
    }

    /** Restore a session on boot via the refresh cookie. Runs at most once. */
    async function init(): Promise<void> {
        if (ready.value) {
            return
        }

        try {
            await refresh()
        } catch {
            clear()
        } finally {
            ready.value = true
        }
    }

    return {
        accessToken,
        user,
        ready,
        isAuthenticated,
        isVerified,
        setSession,
        clear,
        login,
        register,
        refresh,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
        init,
    }
})
