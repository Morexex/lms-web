<script setup lang="ts">
import type { Question, QuestionType, QuizOption } from '~/types/assessment'

const props = defineProps<{ question?: Question | null; loading?: boolean }>()
const emit = defineEmits<{ save: [payload: Record<string, unknown>]; cancel: [] }>()

const isEdit = computed(() => Boolean(props.question))

const type = ref<QuestionType>(props.question?.type ?? 'single_choice')
const prompt = ref(props.question?.prompt ?? '')
const points = ref(props.question?.points ?? 1)
const options = ref<QuizOption[]>(props.question?.options?.map((o) => ({ ...o })) ?? [
    { id: 'o1', text: '' },
    { id: 'o2', text: '' },
])
const correctIds = ref<string[]>(props.question ? [...props.question.correct] : [])
const boolAnswer = ref<'true' | 'false'>(
    props.question?.type === 'true_false' && props.question.correct[0] === 'false' ? 'false' : 'true',
)
const shortAnswers = ref(
    props.question?.type === 'short_answer' ? props.question.correct.join('\n') : '',
)

let counter = options.value.length
const isChoice = computed(() => type.value === 'single_choice' || type.value === 'multiple_choice')
const error = ref('')

function addOption(): void {
    options.value.push({ id: `o${++counter}`, text: '' })
}

function removeOption(id: string): void {
    options.value = options.value.filter((o) => o.id !== id)
    correctIds.value = correctIds.value.filter((c) => c !== id)
}

function toggleSingle(id: string): void {
    correctIds.value = [id]
}

function toggleMultiple(id: string): void {
    correctIds.value = correctIds.value.includes(id)
        ? correctIds.value.filter((c) => c !== id)
        : [...correctIds.value, id]
}

function build(): Record<string, unknown> | null {
    error.value = ''
    if (!prompt.value.trim()) {
        error.value = 'A prompt is required.'
        return null
    }

    const base: Record<string, unknown> = { prompt: prompt.value, points: Number(points.value) }
    if (!isEdit.value) base.type = type.value

    if (isChoice.value) {
        const cleaned = options.value.filter((o) => o.text.trim())
        if (cleaned.length < 2) {
            error.value = 'Add at least two options.'
            return null
        }
        const valid = correctIds.value.filter((id) => cleaned.some((o) => o.id === id))
        if (valid.length === 0) {
            error.value = 'Mark the correct answer.'
            return null
        }
        if (type.value === 'single_choice' && valid.length !== 1) {
            error.value = 'Single choice needs exactly one correct answer.'
            return null
        }
        base.options = cleaned
        base.correct = valid
    } else if (type.value === 'true_false') {
        base.options = null
        base.correct = [boolAnswer.value]
    } else {
        const answers = shortAnswers.value
            .split('\n')
            .map((a) => a.trim())
            .filter(Boolean)
        if (answers.length === 0) {
            error.value = 'Add at least one accepted answer.'
            return null
        }
        base.options = null
        base.correct = answers
    }

    return base
}

function submit(): void {
    const payload = build()
    if (payload) emit('save', payload)
}
</script>

<template>
    <div>
        <v-alert v-if="error" type="warning" variant="tonal" density="compact" class="mb-3">{{ error }}</v-alert>

        <v-select
            v-if="!isEdit"
            v-model="type"
            label="Question type"
            :items="[
                { title: 'Single choice', value: 'single_choice' },
                { title: 'Multiple choice', value: 'multiple_choice' },
                { title: 'True / false', value: 'true_false' },
                { title: 'Short answer', value: 'short_answer' },
            ]"
            density="compact"
            class="mb-2"
        />

        <v-textarea v-model="prompt" label="Question prompt" rows="2" auto-grow density="compact" class="mb-2" />

        <!-- Choice options -->
        <div v-if="isChoice" class="mb-2">
            <div class="text-caption text-medium-emphasis mb-1">
                Options — mark the correct {{ type === 'single_choice' ? 'answer' : 'answers' }}
            </div>

            <!-- Single choice: one radio group manages the selection -->
            <v-radio-group
                v-if="type === 'single_choice'"
                :model-value="correctIds[0] ?? null"
                hide-details
                @update:model-value="(v) => toggleSingle(String(v))"
            >
                <div v-for="option in options" :key="option.id" class="d-flex align-center ga-2 mb-1">
                    <v-radio :value="option.id" color="primary" />
                    <v-text-field v-model="option.text" label="Option text" density="compact" hide-details />
                    <v-btn icon="mdi-close" size="x-small" variant="text" @click="removeOption(option.id)" />
                </div>
            </v-radio-group>

            <!-- Multiple choice: independent checkboxes -->
            <template v-else>
                <div v-for="option in options" :key="option.id" class="d-flex align-center ga-2 mb-1">
                    <v-checkbox
                        :model-value="correctIds.includes(option.id)"
                        color="primary"
                        density="compact"
                        hide-details
                        @update:model-value="toggleMultiple(option.id)"
                    />
                    <v-text-field v-model="option.text" label="Option text" density="compact" hide-details />
                    <v-btn icon="mdi-close" size="x-small" variant="text" @click="removeOption(option.id)" />
                </div>
            </template>

            <v-btn size="small" variant="text" prepend-icon="mdi-plus" @click="addOption">Add option</v-btn>
        </div>

        <!-- True / false -->
        <div v-else-if="type === 'true_false'" class="mb-2">
            <div class="text-caption text-medium-emphasis mb-1">Correct answer</div>
            <v-btn-toggle v-model="boolAnswer" mandatory density="compact">
                <v-btn value="true" size="small">True</v-btn>
                <v-btn value="false" size="small">False</v-btn>
            </v-btn-toggle>
        </div>

        <!-- Short answer -->
        <v-textarea
            v-else
            v-model="shortAnswers"
            label="Accepted answers (one per line)"
            rows="2"
            auto-grow
            density="compact"
            hint="Case-insensitive. Any line counts as correct."
            persistent-hint
            class="mb-2"
        />

        <v-text-field
            v-model.number="points"
            label="Points"
            type="number"
            min="1"
            density="compact"
            style="max-width: 140px"
            class="mb-2"
        />

        <div class="d-flex ga-2">
            <v-btn color="primary" :loading="loading" @click="submit">
                {{ isEdit ? 'Save question' : 'Add question' }}
            </v-btn>
            <v-btn variant="text" @click="emit('cancel')">Cancel</v-btn>
        </div>
    </div>
</template>
