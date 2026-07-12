<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const resent = ref(false)
const resending = ref(false)

async function logout() {
    await auth.logout()
    await navigateTo('/auth/login')
}

async function resend() {
    resending.value = true
    try {
        await auth.resendVerification()
        resent.value = true
    } finally {
        resending.value = false
    }
}
</script>

<template>
    <div class="d-flex flex-column ga-6">
        <div class="d-flex align-center">
            <div>
                <h1 class="text-h4 font-weight-bold">Welcome, {{ auth.user?.name }}</h1>
                <p class="text-body-1 text-medium-emphasis">{{ auth.user?.email }}</p>
            </div>
            <v-spacer />
            <v-btn variant="tonal" color="primary" prepend-icon="mdi-logout" @click="logout">Sign out</v-btn>
        </div>

        <v-alert v-if="auth.user && !auth.isVerified && !resent" type="warning" variant="tonal">
            <div class="d-flex align-center flex-wrap ga-3">
                <span>Please verify your email to unlock everything.</span>
                <v-btn size="small" color="warning" variant="flat" :loading="resending" @click="resend">Resend email</v-btn>
            </div>
        </v-alert>
        <v-alert v-if="resent" type="success" variant="tonal">Verification email sent — check Mailpit.</v-alert>

        <v-card class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-2">You’re signed in 🎉</h2>
            <p class="text-body-2 text-medium-emphasis">
                Milestone 6 is complete end to end. Your session survives a page refresh via silent token rotation.
            </p>
        </v-card>
    </div>
</template>
