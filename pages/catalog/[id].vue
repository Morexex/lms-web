<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { data: course, isLoading, isError } = useCatalogCourse(id)
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/catalog" class="mb-4">Back to catalog</v-btn>

        <v-progress-circular v-if="isLoading" indeterminate color="primary" />

        <v-alert v-else-if="isError || !course" type="warning" variant="tonal">
            This course isn't available.
        </v-alert>

        <template v-else>
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

            <v-btn color="primary" size="large" disabled>
                Enroll — coming soon
            </v-btn>
            <p class="text-caption text-medium-emphasis mt-2">Enrollment arrives with the Learning module.</p>
        </template>
    </div>
</template>
