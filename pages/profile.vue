<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const update = useUpdateProfile()
const { message, handle, reset } = useApiErrors()
const saved = ref(false)

const name = ref(auth.user?.name ?? '')
const bio = ref(auth.user?.bio ?? '')

async function save(): Promise<void> {
    reset()
    saved.value = false
    try {
        await update.mutateAsync({ name: name.value, bio: bio.value })
        saved.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 560px">
        <h1 class="text-h4 font-weight-bold mb-6">Your profile</h1>

        <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-4">Profile updated.</v-alert>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-alert
            v-if="auth.user?.requires_guardian_consent"
            type="warning"
            variant="tonal"
            class="mb-4"
        >
            Your account is limited until a parent or guardian approves it.
        </v-alert>

        <v-card class="pa-6">
            <v-text-field :model-value="auth.user?.email" label="Email" readonly variant="outlined" class="mb-2" />
            <v-text-field v-model="name" label="Full name" />
            <v-textarea v-model="bio" label="Bio" rows="3" auto-grow class="mt-2" />
            <v-btn color="primary" size="large" :loading="update.isPending.value" class="mt-2" @click="save">
                Save changes
            </v-btn>
        </v-card>
    </div>
</template>
