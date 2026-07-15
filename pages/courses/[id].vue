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
        <v-progress-circular v-if="isLoading" indeterminate color="primary" />

        <template v-else-if="course">
            <div class="d-flex align-center mb-6">
                <h1 class="text-h4 font-weight-bold">Edit course</h1>
                <v-spacer />
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-format-list-bulleted" :to="`/courses/${id}/curriculum`" class="mr-2">
                    Curriculum
                </v-btn>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-clipboard-text" :to="`/courses/${id}/quizzes`" class="mr-2">
                    Quizzes
                </v-btn>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-file-document-edit" :to="`/courses/${id}/assignments`" class="mr-2">
                    Assignments
                </v-btn>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-video" :to="`/courses/${id}/live-sessions`" class="mr-2">
                    Live
                </v-btn>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-bullhorn" class="mr-3" @click="announcing = true">
                    Announce
                </v-btn>
                <v-chip :color="course.status === 'published' ? 'success' : 'warning'" variant="tonal">
                    {{ course.status }}
                </v-chip>
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
