<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema } from '~/types/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const { message, handle, reset } = useApiErrors()
const loading = ref(false)

const { defineField, handleSubmit, setErrors, errors } = useForm({
    validationSchema: toTypedSchema(loginSchema),
})
const [email] = defineField('email')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    reset()
    try {
        await auth.login(values.email, values.password)
        await navigateTo('/dashboard')
    } catch (error) {
        handle(error, setErrors)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <v-card class="pa-6 pa-sm-8">
        <h1 class="text-h5 font-weight-bold mb-1">Welcome back</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">Sign in to continue your learning.</p>

        <v-alert v-if="$route.query.reset" type="success" variant="tonal" density="compact" class="mb-4">Password reset — please sign in.</v-alert>

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-form @submit.prevent="onSubmit">
            <v-text-field v-model="email" label="Email" type="email" autocomplete="email" :error-messages="errors.email" />
            <v-text-field v-model="password" label="Password" type="password" autocomplete="current-password" :error-messages="errors.password" class="mt-2" />

            <div class="d-flex justify-end mt-1 mb-4">
                <NuxtLink to="/auth/forgot-password" class="text-body-2 text-secondary text-decoration-none">Forgot password?</NuxtLink>
            </div>

            <v-btn type="submit" color="primary" block size="large" :loading="loading">Sign in</v-btn>
        </v-form>

        <p class="text-body-2 text-center text-medium-emphasis mt-6">
            New to LUMEN?
            <NuxtLink to="/auth/register" class="text-secondary text-decoration-none font-weight-medium">Create an account</NuxtLink>
        </p>
    </v-card>
</template>
