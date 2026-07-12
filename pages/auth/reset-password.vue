<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { resetPasswordSchema } from '~/types/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const route = useRoute()
const auth = useAuthStore()
const { message, handle, reset } = useApiErrors()
const loading = ref(false)

const token = computed(() => String(route.query.token ?? ''))
const email = computed(() => String(route.query.email ?? ''))
const invalidLink = computed(() => token.value === '' || email.value === '')

const { defineField, handleSubmit, setErrors, errors } = useForm({
    validationSchema: toTypedSchema(resetPasswordSchema),
})
const [password] = defineField('password')
const [passwordConfirmation] = defineField('password_confirmation')

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    reset()
    try {
        await auth.resetPassword({
            token: token.value,
            email: email.value,
            password: values.password,
            password_confirmation: values.password_confirmation,
        })
        await navigateTo('/auth/login?reset=1')
    } catch (error) {
        handle(error, setErrors)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <v-card class="pa-6 pa-sm-8">
        <h1 class="text-h5 font-weight-bold mb-1">Choose a new password</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">Resetting for {{ email || 'your account' }}.</p>

        <v-alert v-if="invalidLink" type="warning" variant="tonal" density="compact" class="mb-4">
            This reset link is incomplete. Please request a new one.
        </v-alert>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-form v-if="!invalidLink" @submit.prevent="onSubmit">
            <v-text-field v-model="password" label="New password" type="password" autocomplete="new-password" :error-messages="errors.password" />
            <v-text-field v-model="passwordConfirmation" label="Confirm new password" type="password" autocomplete="new-password" :error-messages="errors.password_confirmation" class="mt-2" />
            <v-btn type="submit" color="primary" block size="large" :loading="loading" class="mt-4">Reset password</v-btn>
        </v-form>

        <p class="text-body-2 text-center text-medium-emphasis mt-6">
            <NuxtLink to="/auth/forgot-password" class="text-secondary text-decoration-none font-weight-medium">Request a new link</NuxtLink>
        </p>
    </v-card>
</template>
