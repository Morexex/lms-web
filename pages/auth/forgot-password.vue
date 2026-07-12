<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { forgotPasswordSchema } from '~/types/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const { message, handle, reset } = useApiErrors()
const loading = ref(false)
const sent = ref('')

const { defineField, handleSubmit, errors } = useForm({
    validationSchema: toTypedSchema(forgotPasswordSchema),
})
const [email] = defineField('email')

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    reset()
    try {
        sent.value = await auth.forgotPassword(values.email)
    } catch (error) {
        handle(error)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <v-card class="pa-6 pa-sm-8">
        <h1 class="text-h5 font-weight-bold mb-1">Reset your password</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">We’ll email you a link to set a new one.</p>

        <v-alert v-if="sent" type="success" variant="tonal" density="compact" class="mb-4">{{ sent }}</v-alert>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-form v-if="!sent" @submit.prevent="onSubmit">
            <v-text-field v-model="email" label="Email" type="email" autocomplete="email" :error-messages="errors.email" />
            <v-btn type="submit" color="primary" block size="large" :loading="loading" class="mt-4">Send reset link</v-btn>
        </v-form>

        <p class="text-body-2 text-center text-medium-emphasis mt-6">
            <NuxtLink to="/auth/login" class="text-secondary text-decoration-none font-weight-medium">Back to sign in</NuxtLink>
        </p>
    </v-card>
</template>
