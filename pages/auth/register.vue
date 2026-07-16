<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { registerSchema } from '~/types/auth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const { message, handle, reset } = useApiErrors()
const loading = ref(false)

const { defineField, handleSubmit, setErrors, errors } = useForm({
    validationSchema: toTypedSchema(registerSchema),
})
const [name] = defineField('name')
const [email] = defineField('email')
const [password] = defineField('password')
const [passwordConfirmation] = defineField('password_confirmation')
const [dateOfBirth] = defineField('date_of_birth')
const [guardianName] = defineField('guardian_name')
const [guardianEmail] = defineField('guardian_email')
const showPassword = ref(false)

const isMinor = computed(() => {
    if (!dateOfBirth.value) return false
    const dob = new Date(dateOfBirth.value)
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)
    return age < 18
})

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    reset()
    try {
        await auth.register(values)
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
        <h1 class="text-h5 font-weight-bold mb-1">Create your account</h1>
        <p class="text-body-2 text-medium-emphasis mb-6">Start learning in minutes.</p>

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-form @submit.prevent="onSubmit">
            <v-text-field
                v-model="name"
                label="Full name"
                autocomplete="name"
                prepend-inner-icon="mdi-account-outline"
                :error-messages="errors.name"
            />
            <v-text-field
                v-model="email"
                label="Email"
                type="email"
                autocomplete="email"
                prepend-inner-icon="mdi-email-outline"
                :error-messages="errors.email"
                class="mt-2"
            />
            <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :error-messages="errors.password"
                hint="At least 8 characters"
                class="mt-2"
                @click:append-inner="showPassword = !showPassword"
            />
            <v-text-field
                v-model="passwordConfirmation"
                label="Confirm password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                prepend-inner-icon="mdi-lock-check-outline"
                :error-messages="errors.password_confirmation"
                class="mt-2"
            />
            <v-text-field
                v-model="dateOfBirth"
                label="Date of birth"
                type="date"
                prepend-inner-icon="mdi-cake-variant-outline"
                :error-messages="errors.date_of_birth"
                hint="Used once, to check whether guardian consent is needed"
                class="mt-2"
            />

            <template v-if="isMinor">
                <v-alert type="info" variant="tonal" density="compact" class="mt-2 mb-1">
                    A parent or guardian must approve accounts for under-18s.
                </v-alert>
                <v-text-field
                    v-model="guardianName"
                    label="Parent / guardian name"
                    prepend-inner-icon="mdi-account-child-outline"
                    :error-messages="errors.guardian_name"
                    class="mt-2"
                />
                <v-text-field
                    v-model="guardianEmail"
                    label="Parent / guardian email"
                    type="email"
                    prepend-inner-icon="mdi-email-outline"
                    :error-messages="errors.guardian_email"
                    class="mt-2"
                />
            </template>

            <v-btn type="submit" color="primary" block size="large" :loading="loading" class="mt-4">Create account</v-btn>
        </v-form>

        <p class="text-body-2 text-center text-medium-emphasis mt-6">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-secondary text-decoration-none font-weight-medium">Sign in</NuxtLink>
        </p>
    </v-card>
</template>
