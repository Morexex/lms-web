<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: course } = useCourse(courseId)
const { data: quizzes, isLoading } = useQuizzes(courseId)
const actions = useQuizActions(courseId)
const { message, handle, reset } = useApiErrors()

const newTitle = ref('')
const builderQuizId = ref<string | null>(null)

async function addQuiz(): Promise<void> {
    if (!newTitle.value.trim()) return
    reset()
    try {
        const quiz = await actions.createQuiz.mutateAsync({ title: newTitle.value })
        newTitle.value = ''
        builderQuizId.value = quiz.id
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/courses/${courseId}`" class="mb-2">Back to course</v-btn>
        <AppPageHeader title="Quizzes" :subtitle="course?.title" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-card v-if="quizzes?.length" class="mb-4">
            <v-list>
                <v-list-item v-for="quiz in quizzes" :key="quiz.id" :title="quiz.title">
                    <template #subtitle>
                        {{ quiz.question_count ?? 0 }} questions · pass {{ quiz.passing_score }}%
                    </template>
                    <template #append>
                        <v-chip :color="quiz.is_published ? 'success' : 'warning'" variant="tonal" size="small" class="mr-2">
                            {{ quiz.is_published ? 'published' : 'draft' }}
                        </v-chip>
                        <v-btn size="small" variant="text" prepend-icon="mdi-pencil" @click="builderQuizId = quiz.id">Edit</v-btn>
                        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="actions.deleteQuiz.mutate(quiz.id)" />
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <AppEmptyState
            v-else-if="!isLoading"
            icon="mdi-clipboard-text-outline"
            title="No quizzes yet"
            description="Create a quiz, then add questions in the builder."
        />

        <v-card class="pa-4">
            <div class="d-flex ga-2">
                <v-text-field v-model="newTitle" label="New quiz title" density="compact" hide-details @keyup.enter="addQuiz" />
                <v-btn color="primary" :loading="actions.createQuiz.isPending.value" @click="addQuiz">Create</v-btn>
            </div>
        </v-card>

        <QuizBuilderDialog
            v-if="builderQuizId"
            :key="builderQuizId"
            :quiz-id="builderQuizId"
            :course-id="courseId"
            @close="builderQuizId = null"
        />
    </div>
</template>
