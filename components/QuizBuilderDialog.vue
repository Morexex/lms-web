<script setup lang="ts">
import type { Question, Quiz } from '~/types/assessment'

const props = defineProps<{ quizId: string; courseId: string }>()
const emit = defineEmits<{ close: [] }>()

const quizIdRef = computed(() => props.quizId)
const { data: quiz, isLoading } = useQuiz(quizIdRef)
const quizActions = useQuizActions(props.courseId)
const questions = useQuestionActions(props.quizId)
const { message, handle, reset } = useApiErrors()

const settings = reactive<Partial<Quiz>>({})
watch(
    quiz,
    (q) => {
        if (q) Object.assign(settings, { title: q.title, instructions: q.instructions, passing_score: q.passing_score, time_limit: q.time_limit, attempt_limit: q.attempt_limit, is_published: q.is_published })
    },
    { immediate: true },
)

const addingQuestion = ref(false)
const editingId = ref<string | null>(null)

const typeLabels: Record<string, string> = {
    single_choice: 'Single choice',
    multiple_choice: 'Multiple choice',
    true_false: 'True / false',
    short_answer: 'Short answer',
}

async function saveSettings(): Promise<void> {
    reset()
    try {
        await quizActions.updateQuiz.mutateAsync({ id: props.quizId, data: settings })
    } catch (error) {
        handle(error)
    }
}

async function createQuestion(payload: Record<string, unknown>): Promise<void> {
    reset()
    try {
        await questions.create.mutateAsync(payload)
        addingQuestion.value = false
    } catch (error) {
        handle(error)
    }
}

async function updateQuestion(id: string, payload: Record<string, unknown>): Promise<void> {
    reset()
    try {
        await questions.update.mutateAsync({ id, data: payload })
        editingId.value = null
    } catch (error) {
        handle(error)
    }
}

function move(index: number, dir: -1 | 1): void {
    const list = [...(quiz.value?.questions ?? [])]
    const target = index + dir
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    questions.reorder.mutate(list.map((q) => q.id))
}

function correctSummary(q: Question): string {
    if (q.type === 'short_answer') return q.correct.join(', ')
    if (q.type === 'true_false') return q.correct[0] ?? ''
    const texts = q.correct.map((id) => q.options?.find((o) => o.id === id)?.text ?? id)
    return texts.join(', ')
}
</script>

<template>
    <v-dialog :model-value="true" max-width="760" scrollable @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Quiz builder</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>

            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
                <v-progress-linear v-if="isLoading" indeterminate color="primary" />

                <template v-if="quiz">
                    <!-- Settings -->
                    <div class="text-subtitle-2 font-weight-bold mb-2">Settings</div>
                    <v-text-field v-model="settings.title" label="Title" density="compact" class="mb-2" hide-details />
                    <v-textarea v-model="settings.instructions" label="Instructions" rows="2" auto-grow density="compact" class="mb-2" hide-details />
                    <div class="d-flex flex-wrap ga-2 mb-2">
                        <v-text-field v-model.number="settings.passing_score" label="Passing %" type="number" min="0" max="100" density="compact" hide-details style="max-width: 130px" />
                        <v-text-field v-model.number="settings.time_limit" label="Time limit (min)" type="number" min="1" density="compact" hide-details style="max-width: 160px" />
                        <v-text-field v-model.number="settings.attempt_limit" label="Attempt limit" type="number" min="1" density="compact" hide-details style="max-width: 150px" />
                    </div>
                    <div class="d-flex align-center ga-4 mb-2">
                        <v-switch v-model="settings.is_published" color="primary" label="Published" density="compact" hide-details />
                        <v-spacer />
                        <v-btn color="primary" variant="tonal" :loading="quizActions.updateQuiz.isPending.value" @click="saveSettings">
                            Save settings
                        </v-btn>
                    </div>

                    <v-divider class="my-4" />

                    <!-- Questions -->
                    <div class="d-flex align-center mb-2">
                        <div class="text-subtitle-2 font-weight-bold">Questions ({{ quiz.questions?.length ?? 0 }})</div>
                        <v-spacer />
                        <v-btn size="small" color="primary" variant="text" prepend-icon="mdi-plus" @click="addingQuestion = true; editingId = null">
                            Add question
                        </v-btn>
                    </div>

                    <v-card v-if="addingQuestion" variant="tonal" class="pa-3 mb-3">
                        <QuizQuestionForm :loading="questions.create.isPending.value" @save="createQuestion" @cancel="addingQuestion = false" />
                    </v-card>

                    <AppEmptyState
                        v-if="!(quiz.questions?.length) && !addingQuestion"
                        icon="mdi-help-circle-outline"
                        title="No questions yet"
                        description="Add your first question to build this quiz."
                    />

                    <div v-for="(q, i) in quiz.questions ?? []" :key="q.id" class="mb-2">
                        <v-card variant="outlined" class="pa-3">
                            <div class="d-flex align-center">
                                <v-chip size="x-small" variant="tonal" class="mr-2">{{ typeLabels[q.type] }}</v-chip>
                                <span class="text-body-2 font-weight-medium">{{ q.prompt }}</span>
                                <v-spacer />
                                <span class="text-caption text-medium-emphasis mr-2">{{ q.points }} pt</span>
                                <v-btn icon="mdi-arrow-up" size="x-small" variant="text" @click="move(i, -1)" />
                                <v-btn icon="mdi-arrow-down" size="x-small" variant="text" @click="move(i, 1)" />
                                <v-btn icon="mdi-pencil" size="x-small" variant="text" @click="editingId = q.id; addingQuestion = false" />
                                <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="questions.remove.mutate(q.id)" />
                            </div>
                            <div class="text-caption text-medium-emphasis mt-1">
                                Correct: {{ correctSummary(q) }}
                            </div>

                            <div v-if="editingId === q.id" class="mt-3">
                                <v-divider class="mb-3" />
                                <QuizQuestionForm
                                    :question="q"
                                    :loading="questions.update.isPending.value"
                                    @save="(payload) => updateQuestion(q.id, payload)"
                                    @cancel="editingId = null"
                                />
                            </div>
                        </v-card>
                    </div>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
