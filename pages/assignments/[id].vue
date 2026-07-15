<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const assignmentId = useRoute().params.id as string
const { data: view, isLoading, isError } = useAssignmentView(assignmentId)
const submitAction = useSubmitAssignment(assignmentId)
const { message, handle, reset } = useApiErrors()

const body = ref('')
const file = ref<File | null>(null)
const saved = ref(false)

const submission = computed(() => view.value?.submission ?? null)
const isGraded = computed(() => submission.value?.status === 'graded')

watch(submission, (s) => {
    if (s && !body.value) body.value = s.body ?? ''
}, { immediate: true })

function onSelect(value: File | File[] | null): void {
    file.value = Array.isArray(value) ? (value[0] ?? null) : value
}

async function submit(): Promise<void> {
    reset()
    saved.value = false
    try {
        await submitAction.mutateAsync({ body: body.value, file: file.value })
        file.value = null
        saved.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/learning" class="mb-2">My learning</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <v-alert v-if="isError" type="warning" variant="tonal" class="mb-4">
            This assignment isn't available — you may need to enrol in the course first.
        </v-alert>

        <template v-if="view">
            <AppPageHeader :title="view.title" :subtitle="`${view.points} points`" />

            <v-card v-if="view.brief" class="pa-4 mb-4" variant="tonal">
                <p class="text-body-1" style="white-space: pre-wrap">{{ view.brief }}</p>
                <p v-if="view.due_at" class="text-caption text-medium-emphasis mt-2 mb-0">
                    Due {{ new Date(view.due_at).toLocaleDateString() }}
                </p>
            </v-card>

            <!-- Grade feedback -->
            <v-card v-if="isGraded" class="pa-4 mb-4" color="success" variant="tonal">
                <div class="d-flex align-center mb-1">
                    <v-icon icon="mdi-check-decagram" class="mr-2" />
                    <span class="text-h6 font-weight-bold">{{ submission?.score }} / {{ view.points }}</span>
                </div>
                <p v-if="submission?.feedback" class="text-body-2 mb-0">{{ submission?.feedback }}</p>
            </v-card>

            <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-4">Submission saved.</v-alert>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <!-- Submission form -->
            <v-card class="pa-4">
                <div class="text-subtitle-2 font-weight-bold mb-2">
                    {{ isGraded ? 'Your submission' : submission ? 'Update your submission' : 'Your submission' }}
                </div>

                <template v-if="isGraded">
                    <p class="text-body-2" style="white-space: pre-wrap">{{ submission?.body || '—' }}</p>
                    <v-btn
                        v-if="submission?.media_url"
                        :href="submission.media_url"
                        target="_blank"
                        variant="tonal"
                        size="small"
                        prepend-icon="mdi-paperclip"
                    >
                        View attachment
                    </v-btn>
                    <p class="text-caption text-medium-emphasis mt-2 mb-0">Graded — no further changes allowed.</p>
                </template>

                <template v-else>
                    <v-textarea v-model="body" label="Written work" rows="5" auto-grow density="compact" class="mb-2" hide-details />
                    <v-file-input
                        label="Attach a file (optional)"
                        prepend-icon="mdi-paperclip"
                        density="compact"
                        hide-details
                        class="mb-3"
                        @update:model-value="onSelect"
                    />
                    <v-btn color="primary" :loading="submitAction.isPending.value" @click="submit">
                        {{ submission ? 'Resubmit' : 'Submit' }}
                    </v-btn>
                </template>
            </v-card>
        </template>
    </div>
</template>
