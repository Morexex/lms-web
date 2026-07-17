<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { can, active } = useInstitutionPermissions()

/** Institution admins get an operations overview; everyone else the learner home. */
const isAdmin = computed(() => can('members.manage'))
const institutionName = computed(() => active.value?.institution.name ?? 'your institution')

// --- Email verification (preserved behaviour) ---
const resent = ref(false)
const resending = ref(false)
async function resend(): Promise<void> {
    resending.value = true
    try {
        await auth.resendVerification()
        resent.value = true
    } finally {
        resending.value = false
    }
}

// --- Personal greeting ---
const firstName = computed(() => (auth.user?.name ?? '').split(' ')[0] || 'there')
const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
})
const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
</script>

<template>
    <div class="d-flex flex-column ga-6">
        <!-- Greeting -->
        <div>
            <p class="text-body-2 text-medium-emphasis mb-1">{{ today }}</p>
            <h1 class="text-h4 font-weight-bold mb-1">{{ greeting }}, {{ firstName }} 👋</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">
                <template v-if="isAdmin">Here's how {{ institutionName }} is doing today.</template>
                <template v-else>A little progress every day adds up.</template>
            </p>
        </div>

        <!-- Email verification (preserved) -->
        <v-alert v-if="auth.user && !auth.isVerified && !resent" type="warning" variant="tonal">
            <div class="d-flex align-center flex-wrap ga-3">
                <span>Please verify your email to unlock everything.</span>
                <v-btn size="small" color="warning" variant="flat" :loading="resending" @click="resend">Resend email</v-btn>
            </div>
        </v-alert>
        <v-alert v-if="resent" type="success" variant="tonal">Verification email sent — check your inbox.</v-alert>

        <!-- Role decides the whole tree, and role resolves only on the client
             (auth + institution restore there) — so render client-side to avoid
             a server/client hydration mismatch. -->
        <ClientOnly>
            <template #fallback>
                <v-skeleton-loader type="article, article" class="rounded-xl" />
            </template>
            <AdminDashboard v-if="isAdmin" />
            <LearnerDashboard v-else />
        </ClientOnly>
    </div>
</template>
