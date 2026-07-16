<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { data: analytics, isLoading, isError } = useCourseAnalytics(id)

const quizItems = computed(() =>
    (analytics.value?.quiz_distribution ?? []).map((b) => ({ label: b.bucket, value: b.count })),
)
const dropOffItems = computed(() =>
    (analytics.value?.drop_off ?? []).map((l) => ({ label: `${l.position}. ${l.title}`, value: l.completed })),
)
const hasQuizData = computed(() => quizItems.value.some((i) => i.value > 0))
</script>

<template>
    <div style="max-width: 760px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/analytics" class="mb-2">All analytics</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <v-alert v-if="isError" type="warning" variant="tonal" class="mb-4">
            This course's analytics aren't available — you may need staff access.
        </v-alert>

        <template v-if="analytics">
            <AppPageHeader :title="analytics.course.title" subtitle="Course engagement" />

            <v-row class="mb-2">
                <v-col cols="4"><AppStatCard label="Enrollments" :value="analytics.engagement.enrollments" icon="mdi-account-school" /></v-col>
                <v-col cols="4"><AppStatCard label="Completions" :value="analytics.engagement.completions" icon="mdi-check-decagram" color="success" /></v-col>
                <v-col cols="4"><AppStatCard label="Completion rate" :value="`${analytics.engagement.completion_rate}%`" icon="mdi-chart-arc" color="secondary" /></v-col>
            </v-row>

            <v-card class="pa-5 mb-4">
                <h2 class="text-subtitle-1 font-weight-bold mb-1">
                    <v-icon icon="mdi-chart-bar" size="small" class="mr-1" /> Quiz score distribution
                </h2>
                <p class="text-caption text-medium-emphasis mb-4">Submitted attempts across all quizzes in this course, by score band.</p>
                <BarChart v-if="hasQuizData" :items="quizItems" />
                <p v-else class="text-body-2 text-medium-emphasis mb-0">No quiz attempts yet.</p>
            </v-card>

            <v-card class="pa-5">
                <h2 class="text-subtitle-1 font-weight-bold mb-1">
                    <v-icon icon="mdi-stairs-down" size="small" class="mr-1" /> Lesson drop-off
                </h2>
                <p class="text-caption text-medium-emphasis mb-4">
                    Completions per lesson in course order — a falling curve shows where learners stop.
                </p>
                <BarChart
                    :items="dropOffItems"
                    color="rgb(var(--v-theme-secondary))"
                    empty-text="No lessons in this course yet."
                />
            </v-card>
        </template>
    </div>
</template>
