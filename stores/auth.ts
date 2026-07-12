import { defineStore } from 'pinia'
import type { AuthUser, SessionPayload } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null)
    const user = ref<AuthUser | null>(null)
    const ready = ref(false) // has a session-restore attempt completed?
    const impersonator = ref<{ id: string; name: string } | null>(null)

    const isAuthenticated = computed(() => user.value !== null)
    const isVerified = computed(() => user.value?.email_verified === true)
    const isImpersonating = computed(() => impersonator.value !== null)

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
        date_of_birth: string
        guardian_name?: string
        guardian_email?: string
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

    /**
     * Swap the session to an impersonated user. The admin's httpOnly refresh
     * cookie is untouched, so stopImpersonation() restores them via refresh().
     */
    async function beginImpersonation(accessTokenValue: string, admin: { id: string; name: string }): Promise<void> {
        accessToken.value = accessTokenValue
        impersonator.value = admin
        const { data } = await useNuxtApp().$api.get<{ data: AuthUser }>('/api/v1/auth/me')
        user.value = data.data
    }

    async function stopImpersonation(): Promise<void> {
        impersonator.value = null
        await refresh() // restores the admin session from their refresh cookie
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
        impersonator,
        isAuthenticated,
        isVerified,
        isImpersonating,
        setSession,
        clear,
        login,
        register,
        refresh,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
        beginImpersonation,
        stopImpersonation,
        init,
    }
})
