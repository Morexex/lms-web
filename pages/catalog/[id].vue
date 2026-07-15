<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { data: course, isLoading, isError } = useCatalogCourse(id)
const enroll = useEnroll()
const { message: enrollMessage, handle: handleEnroll, reset } = useApiErrors()

async function doEnroll(): Promise<void> {
    reset()
    try {
        await enroll.mutateAsync(id)
        await navigateTo(`/learn/${id}`)
    } catch (error) {
        handleEnroll(error)
    }
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/catalog" class="mb-4">Back to catalog</v-btn>

        <v-progress-circular v-if="isLoading" indeterminate color="primary" />

        <v-alert v-else-if="isError || !course" type="warning" variant="tonal">
            This course isn't available.
        </v-alert>

        <template v-else>
            <v-img v-if="course.cover_image_url" :src="course.cover_image_url" height="240" cover rounded="lg" class="mb-4" />
            <div class="text-caption text-medium-emphasis mb-1">{{ course.category?.name ?? 'Uncategorised' }}</div>
            <h1 class="text-h4 font-weight-bold mb-2">{{ course.title }}</h1>
            <div class="d-flex align-center ga-3 mb-6">
                <v-chip variant="tonal">{{ courseLevelLabel(course.level) }}</v-chip>
                <span class="text-h6 font-weight-bold text-primary">{{ formatPrice(course) }}</span>
            </div>

            <v-card class="pa-6 mb-4">
                <p class="text-body-1 font-weight-medium mb-3">{{ course.summary }}</p>
                <p class="text-body-2" style="white-space: pre-wrap">{{ course.description }}</p>
            </v-card>

            <v-alert v-if="enrollMessage" type="warning" variant="tonal" density="compact" class="mb-3">{{ enrollMessage }}</v-alert>
            <v-btn color="primary" size="large" :loading="enroll.isPending.value" @click="doEnroll">
                {{ course.is_free ? 'Enroll for free' : 'Enroll' }}
            </v-btn>
        </template>
    </div>
</template>
