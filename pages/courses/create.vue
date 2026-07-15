<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const save = useSaveCourse()
const { message, handle, reset } = useApiErrors()

async function onSubmit(data: Record<string, unknown>): Promise<void> {
    reset()
    try {
        const course = await save.mutateAsync({ data })
        await navigateTo(`/courses/${course.id}`)
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <h1 class="text-h4 font-weight-bold mb-6">New course</h1>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <CourseForm :loading="save.isPending.value" @submit="onSubmit" />
    </div>
</template>
