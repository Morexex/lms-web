<script setup lang="ts">
import type { Assignment } from '~/types/assessment'

definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: course } = useCourse(courseId)
const { data: assignments, isLoading } = useAssignments(courseId)
const actions = useAssignmentActions(courseId)
const { message, handle, reset } = useApiErrors()

const blank = (): Partial<Assignment> => ({ title: '', brief: '', points: 100, due_at: null, is_published: false })
const draft = ref<Partial<Assignment>>(blank())
const editing = ref<Assignment | null>(null)
const gradingFor = ref<Assignment | null>(null)

const form = computed<Partial<Assignment>>(() => (editing.value ? editing.value : draft.value))

async function save(): Promise<void> {
    if (!form.value.title?.trim()) return
    reset()
    try {
        if (editing.value) {
            await actions.update.mutateAsync({ id: editing.value.id, data: editing.value })
            editing.value = null
        } else {
            await actions.create.mutateAsync(draft.value)
            draft.value = blank()
        }
    } catch (error) {
        handle(error)
    }
}

function togglePublish(a: Assignment): void {
    actions.update.mutate({ id: a.id, data: { is_published: !a.is_published } })
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/courses/${courseId}`" class="mb-2">Back to course</v-btn>
        <AppPageHeader title="Assignments" :subtitle="course?.title" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-card v-if="assignments?.length" class="mb-4">
            <v-list>
                <v-list-item v-for="a in assignments" :key="a.id" :title="a.title">
                    <template #subtitle>{{ a.points }} pts · {{ a.submission_count ?? 0 }} submissions</template>
                    <template #append>
                        <v-chip :color="a.is_published ? 'success' : 'warning'" variant="tonal" size="small" class="mr-2">
                            {{ a.is_published ? 'published' : 'draft' }}
                        </v-chip>
                        <v-btn size="small" variant="text" prepend-icon="mdi-clipboard-check" @click="gradingFor = a">Submissions</v-btn>
                        <v-btn size="small" variant="text" @click="togglePublish(a)">{{ a.is_published ? 'Unpublish' : 'Publish' }}</v-btn>
                        <v-btn icon="mdi-pencil" size="small" variant="text" @click="editing = { ...a }" />
                        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="actions.remove.mutate(a.id)" />
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <AppEmptyState
            v-else-if="!isLoading"
            icon="mdi-file-document-edit-outline"
            title="No assignments yet"
            description="Create an assignment brief for your students below."
        />

        <!-- Create / edit form -->
        <v-card class="pa-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">{{ editing ? 'Edit assignment' : 'New assignment' }}</div>
            <v-text-field v-model="form.title" label="Title" density="compact" class="mb-2" hide-details />
            <v-textarea v-model="form.brief" label="Brief / instructions" rows="3" auto-grow density="compact" class="mb-2" hide-details />
            <div class="d-flex flex-wrap align-center ga-3">
                <v-text-field v-model.number="form.points" label="Points" type="number" min="1" density="compact" hide-details style="max-width: 130px" />
                <v-text-field v-model="form.due_at" label="Due (optional)" type="datetime-local" density="compact" hide-details style="max-width: 230px" />
                <v-switch v-model="form.is_published" color="primary" label="Published" density="compact" hide-details />
                <v-spacer />
                <v-btn v-if="editing" variant="text" @click="editing = null">Cancel</v-btn>
                <v-btn color="primary" :loading="actions.create.isPending.value || actions.update.isPending.value" @click="save">
                    {{ editing ? 'Save' : 'Create' }}
                </v-btn>
            </div>
        </v-card>

        <AssignmentSubmissionsDialog
            v-if="gradingFor"
            :key="gradingFor.id"
            :assignment-id="gradingFor.id"
            :title="gradingFor.title"
            :points="gradingFor.points"
            @close="gradingFor = null"
        />
    </div>
</template>
