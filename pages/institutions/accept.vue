<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const token = computed(() => String(useRoute().query.token ?? ''))
const { data: preview, isError, isLoading } = useInvitationPreview(token.value)
const accept = useAcceptInvitation()
const { message, handle, reset } = useApiErrors()
const done = ref(false)

async function onAccept(): Promise<void> {
    reset()
    try {
        await accept.mutateAsync(token.value)
        done.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 480px" class="mx-auto">
        <v-card class="pa-6 text-center">
            <template v-if="isLoading">
                <v-progress-circular indeterminate color="primary" />
            </template>

            <template v-else-if="done">
                <v-icon icon="mdi-check-circle" color="success" size="56" class="mb-3" />
                <h1 class="text-h6 font-weight-bold mb-2">You’re in!</h1>
                <v-btn color="primary" to="/people">Go to your institution</v-btn>
            </template>

            <template v-else-if="isError || !preview">
                <v-icon icon="mdi-alert-circle" color="error" size="56" class="mb-3" />
                <h1 class="text-h6 font-weight-bold mb-2">Invitation unavailable</h1>
                <p class="text-body-2 text-medium-emphasis">This invitation is invalid or has expired.</p>
            </template>

            <template v-else>
                <h1 class="text-h6 font-weight-bold mb-1">Join {{ preview.institution }}</h1>
                <p class="text-body-2 text-medium-emphasis mb-4">You’ve been invited as a {{ preview.role }}.</p>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
                <v-btn color="primary" size="large" :loading="accept.isPending.value" @click="onAccept">Accept invitation</v-btn>
            </template>
        </v-card>
    </div>
</template>
