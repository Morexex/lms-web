<script setup lang="ts">
import type { AnswerMap, AttemptResult, AttemptStart } from '~/types/assessment'

definePageMeta({ middleware: 'auth' })

const quizId = useRoute().params.id as string
const { data: info, isLoading, isError, refetch } = useQuizTake(quizId)
const { start, submit } = useAttemptActions()
const { message, handle, reset } = useApiErrors()

const attempt = ref<AttemptStart | null>(null)
const result = ref<AttemptResult | null>(null)
const answers = ref<AnswerMap>({})

async function begin(): Promise<void> {
    reset()
    result.value = null
    answers.value = {}
    try {
        attempt.value = await start.mutateAsync(quizId)
    } catch (error) {
        handle(error)
    }
}

async function finish(): Promise<void> {
    if (!attempt.value) return
    reset()
    try {
        result.value = await submit.mutateAsync({ attemptId: attempt.value.id, answers: answers.value })
        attempt.value = null
    } catch (error) {
        handle(error)
    }
}

function toggleMulti(qid: string, optionId: string): void {
    const current = Array.isArray(answers.value[qid]) ? (answers.value[qid] as string[]) : []
    answers.value[qid] = current.includes(optionId)
        ? current.filter((c) => c !== optionId)
        : [...current, optionId]
}

async function retake(): Promise<void> {
    result.value = null
    await refetch()
}

function answerText(value: string | string[] | null): string {
    if (value === null) return '—'
    return Array.isArray(value) ? value.join(', ') : value
}
</script>

<template>
    <div style="max-width: 720px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/learning" class="mb-2">My learning</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <v-alert v-if="isError" type="warning" variant="tonal" class="mb-4">
            This quiz isn't available — you may need to enrol in the course first.
        </v-alert>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <!-- Results -->
        <template v-if="result">
            <v-card class="pa-6 mb-4 text-center">
                <v-icon
                    :icon="result.passed ? 'mdi-check-decagram' : 'mdi-close-octagon'"
                    :color="result.passed ? 'success' : 'error'"
                    size="56"
                    class="mb-2"
                />
                <h1 class="text-h5 font-weight-bold">{{ result.passed ? 'Passed' : 'Not passed' }}</h1>
                <p class="text-h6 text-medium-emphasis">
                    {{ result.score }} / {{ result.max_score }} · pass mark {{ result.passing_score }}%
                </p>
            </v-card>

            <v-card v-for="q in result.questions" :key="q.id" class="pa-4 mb-2" variant="outlined">
                <div class="d-flex align-start">
                    <v-icon
                        :icon="q.is_correct ? 'mdi-check-circle' : 'mdi-close-circle'"
                        :color="q.is_correct ? 'success' : 'error'"
                        class="mr-2 mt-1"
                    />
                    <div class="flex-grow-1">
                        <p class="text-body-1 font-weight-medium mb-1">{{ q.prompt }}</p>
                        <p class="text-body-2 text-medium-emphasis mb-0">Your answer: {{ answerText(q.your_answer) }}</p>
                        <p v-if="!q.is_correct" class="text-body-2 text-success mb-0">Correct: {{ q.correct.join(', ') }}</p>
                    </div>
                    <span class="text-caption text-medium-emphasis">{{ q.awarded }} / {{ q.points }}</span>
                </div>
            </v-card>

            <v-btn v-if="info?.can_attempt" color="primary" variant="tonal" class="mt-2" @click="retake">Retake</v-btn>
        </template>

        <!-- Taking -->
        <template v-else-if="attempt">
            <h1 class="text-h5 font-weight-bold mb-1">{{ attempt.quiz.title }}</h1>
            <p v-if="attempt.quiz.instructions" class="text-body-2 text-medium-emphasis mb-4">{{ attempt.quiz.instructions }}</p>

            <v-card v-for="(q, i) in attempt.questions" :key="q.id" class="pa-4 mb-3">
                <p class="text-body-1 font-weight-medium mb-3">{{ i + 1 }}. {{ q.prompt }}</p>

                <v-radio-group v-if="q.type === 'single_choice'" v-model="answers[q.id]" hide-details>
                    <v-radio v-for="o in q.options ?? []" :key="o.id" :label="o.text" :value="o.id" color="primary" />
                </v-radio-group>

                <div v-else-if="q.type === 'multiple_choice'">
                    <v-checkbox
                        v-for="o in q.options ?? []"
                        :key="o.id"
                        :label="o.text"
                        :model-value="Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(o.id)"
                        color="primary"
                        density="compact"
                        hide-details
                        @update:model-value="toggleMulti(q.id, o.id)"
                    />
                </div>

                <v-btn-toggle v-else-if="q.type === 'true_false'" v-model="answers[q.id]" mandatory density="compact">
                    <v-btn value="true">True</v-btn>
                    <v-btn value="false">False</v-btn>
                </v-btn-toggle>

                <v-text-field v-else v-model="answers[q.id]" label="Your answer" density="compact" hide-details />
            </v-card>

            <v-btn color="primary" size="large" :loading="submit.isPending.value" @click="finish">Submit quiz</v-btn>
        </template>

        <!-- Intro -->
        <template v-else-if="info">
            <v-card class="pa-6">
                <h1 class="text-h5 font-weight-bold mb-2">{{ info.title }}</h1>
                <p v-if="info.instructions" class="text-body-1 mb-3">{{ info.instructions }}</p>
                <div class="d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis mb-4">
                    <span><v-icon icon="mdi-help-circle-outline" size="small" /> {{ info.question_count }} questions</span>
                    <span><v-icon icon="mdi-target" size="small" /> pass {{ info.passing_score }}%</span>
                    <span v-if="info.time_limit"><v-icon icon="mdi-clock-outline" size="small" /> {{ info.time_limit }} min</span>
                    <span v-if="info.attempt_limit">
                        <v-icon icon="mdi-refresh" size="small" /> {{ info.attempts_used }} / {{ info.attempt_limit }} attempts used
                    </span>
                </div>
                <v-btn
                    v-if="info.can_attempt"
                    color="primary"
                    size="large"
                    :loading="start.isPending.value"
                    @click="begin"
                >
                    {{ info.in_progress_attempt_id ? 'Resume attempt' : 'Start quiz' }}
                </v-btn>
                <v-alert v-else type="info" variant="tonal" density="compact">
                    You've used all your attempts for this quiz.
                </v-alert>
            </v-card>
        </template>
    </div>
</template>
