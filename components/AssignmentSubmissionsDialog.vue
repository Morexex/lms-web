<script setup lang="ts">
import type { Submission } from '~/types/assessment'

const props = defineProps<{ assignmentId: string; title: string; points: number }>()
const emit = defineEmits<{ close: [] }>()

const { data: submissions, isLoading } = useSubmissions(props.assignmentId)
const grade = useGradeSubmission(props.assignmentId)
const { message, handle, reset } = useApiErrors()

const scores = reactive<Record<string, number>>({})
const feedbacks = reactive<Record<string, string>>({})

function seed(s: Submission): void {
    if (!(s.id in scores)) scores[s.id] = s.score ?? props.points
    if (!(s.id in feedbacks)) feedbacks[s.id] = s.feedback ?? ''
}

watch(submissions, (list) => list?.forEach(seed), { immediate: true })

async function submitGrade(s: Submission): Promise<void> {
    reset()
    try {
        await grade.mutateAsync({ id: s.id, score: Number(scores[s.id]), feedback: feedbacks[s.id] || null })
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="720" scrollable @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Submissions — {{ title }}</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>

            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
                <v-progress-linear v-if="isLoading" indeterminate color="primary" />

                <AppEmptyState
                    v-if="!isLoading && !submissions?.length"
                    icon="mdi-inbox-outline"
                    title="No submissions yet"
                    description="Students' work will appear here for grading."
                />

                <div v-for="s in submissions ?? []" :key="s.id" class="mb-4">
                    <v-card variant="outlined" class="pa-3">
                        <div class="d-flex align-center mb-2">
                            <v-avatar size="28" color="primary" variant="tonal" class="mr-2">
                                <span class="text-caption">{{ (s.student?.name ?? '?').charAt(0) }}</span>
                            </v-avatar>
                            <span class="font-weight-medium">{{ s.student?.name ?? 'Student' }}</span>
                            <v-spacer />
                            <v-chip :color="s.status === 'graded' ? 'success' : 'warning'" variant="tonal" size="small">
                                {{ s.status }}
                            </v-chip>
                        </div>

                        <p v-if="s.body" class="text-body-2 mb-2" style="white-space: pre-wrap">{{ s.body }}</p>
                        <v-btn
                            v-if="s.media_url"
                            :href="s.media_url"
                            target="_blank"
                            size="small"
                            variant="tonal"
                            prepend-icon="mdi-paperclip"
                            class="mb-3"
                        >
                            View attachment
                        </v-btn>

                        <v-divider class="my-2" />
                        <div class="d-flex align-end ga-2">
                            <v-text-field
                                v-model.number="scores[s.id]"
                                label="Score"
                                type="number"
                                min="0"
                                :max="points"
                                :suffix="`/ ${points}`"
                                density="compact"
                                hide-details
                                style="max-width: 140px"
                            />
                            <v-text-field v-model="feedbacks[s.id]" label="Feedback" density="compact" hide-details />
                            <v-btn color="primary" :loading="grade.isPending.value" @click="submitGrade(s)">
                                {{ s.status === 'graded' ? 'Update' : 'Grade' }}
                            </v-btn>
                        </div>
                    </v-card>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
