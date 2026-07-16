<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { can } = useInstitutionPermissions()
const { data: course, isLoading } = useCourse(id)
const save = useSaveCourse()
const status = useCourseStatus()
const { message, handle, reset } = useApiErrors()
const saved = ref(false)
const announcing = ref(false)

async function onSubmit(data: Record<string, unknown>): Promise<void> {
    reset()
    saved.value = false
    try {
        await save.mutateAsync({ id, data })
        saved.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <v-skeleton-loader v-if="isLoading" type="heading, chip, article" class="rounded-xl" />

        <template v-else-if="course">
            <!-- Header: identity row first, then a wrapping workspace toolbar -->
            <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/courses" class="mb-2">All courses</v-btn>
            <div class="d-flex align-center flex-wrap ga-3 mb-1">
                <h1 class="text-h4 font-weight-bold mb-0">{{ course.title }}</h1>
                <v-chip :color="course.status === 'published' ? 'success' : 'warning'" variant="tonal" size="small">
                    {{ course.status }}
                </v-chip>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">Course workspace — content, assessments, and community.</p>

            <div class="d-flex flex-wrap ga-2 mb-6">
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-format-list-bulleted" :to="`/courses/${id}/curriculum`">
                    Curriculum
                </v-btn>
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-clipboard-text" :to="`/courses/${id}/quizzes`">
                    Quizzes
                </v-btn>
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-file-document-edit" :to="`/courses/${id}/assignments`">
                    Assignments
                </v-btn>
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-video" :to="`/courses/${id}/live-sessions`">
                    Live
                </v-btn>
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-forum" :to="`/courses/${id}/discussion`">
                    Discussion
                </v-btn>
                <v-btn variant="tonal" color="primary" size="small" prepend-icon="mdi-bullhorn" @click="announcing = true">
                    Announce
                </v-btn>
            </div>

            <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-4">Saved.</v-alert>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <CourseForm :course="course" :loading="save.isPending.value" @submit="onSubmit" />

            <div v-if="can('courses.publish')" class="d-flex ga-2 mt-4">
                <v-btn
                    v-if="course.status !== 'published'"
                    color="success"
                    variant="tonal"
                    @click="status.mutate({ id, action: 'publish' })"
                >
                    Publish
                </v-btn>
                <v-btn v-else color="warning" variant="tonal" @click="status.mutate({ id, action: 'unpublish' })">
                    Unpublish
                </v-btn>
                <v-btn color="grey" variant="tonal" @click="status.mutate({ id, action: 'archive' })">Archive</v-btn>
            </div>
        </template>

        <CourseAnnounceDialog v-if="announcing" :course-id="id" @close="announcing = false" />
    </div>
</template>
