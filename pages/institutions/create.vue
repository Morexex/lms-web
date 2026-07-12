<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

definePageMeta({ middleware: 'auth' })

const create = useCreateInstitution()
const institution = useInstitutionStore()
const { message, handle, reset } = useApiErrors()

const schema = z.object({ name: z.string().min(2, 'Please enter a name') })
const { defineField, handleSubmit, setErrors, errors } = useForm({ validationSchema: toTypedSchema(schema) })
const [name] = defineField('name')

const onSubmit = handleSubmit(async (values) => {
    reset()
    try {
        const created = await create.mutateAsync({ name: values.name })
        institution.setActive(created.slug)
        await navigateTo('/people')
    } catch (error) {
        handle(error, setErrors)
    }
})
</script>

<template>
    <div style="max-width: 520px">
        <h1 class="text-h4 font-weight-bold mb-1">Create an institution</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">You’ll become its first administrator.</p>

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-card class="pa-6">
            <v-form @submit.prevent="onSubmit">
                <v-text-field v-model="name" label="Institution name" :error-messages="errors.name" />
                <v-btn type="submit" color="primary" size="large" :loading="create.isPending.value" class="mt-2">
                    Create institution
                </v-btn>
            </v-form>
        </v-card>
    </div>
</template>
