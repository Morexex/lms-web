<script setup lang="ts">
const auth = useAuthStore()
const stopping = ref(false)

async function stop(): Promise<void> {
    stopping.value = true
    try {
        await auth.stopImpersonation()
        await navigateTo('/platform/users')
    } finally {
        stopping.value = false
    }
}
</script>

<template>
    <v-banner v-if="auth.isImpersonating" color="warning" bgcolor="warning" lines="one" density="comfortable" sticky>
        <template #prepend>
            <v-icon icon="mdi-account-switch" />
        </template>
        <v-banner-text>
            You are viewing LUMEN as <strong>{{ auth.user?.name }}</strong>.
        </v-banner-text>
        <template #actions>
            <v-btn variant="flat" color="white" size="small" :loading="stopping" @click="stop">Stop impersonating</v-btn>
        </template>
    </v-banner>
</template>
