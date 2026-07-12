<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const success = computed(() => String(useRoute().query.status ?? '') === 'success')
</script>

<template>
    <v-card class="pa-6 pa-sm-8 text-center">
        <v-icon :icon="success ? 'mdi-check-circle' : 'mdi-alert-circle'" :color="success ? 'success' : 'error'" size="64" class="mb-4" />
        <h1 class="text-h5 font-weight-bold mb-2">{{ success ? 'Email verified' : 'Verification failed' }}</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">
            {{ success ? 'Your email is confirmed. You can now sign in.' : 'This link is invalid or has expired.' }}
        </p>
        <v-btn color="primary" block size="large" to="/auth/login">Continue to sign in</v-btn>
    </v-card>
</template>
