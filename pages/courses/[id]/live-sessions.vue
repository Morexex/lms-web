<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: course } = useCourse(courseId)
const { data: sessions, isLoading } = useCourseLiveSessions(courseId)
const actions = useLiveSessionActions(courseId)
const { message, handle, reset } = useApiErrors()

const providers = [
    { title: 'Jitsi (auto-generated link)', value: 'jitsi' },
    { title: 'Zoom', value: 'zoom' },
    { title: 'Google Meet', value: 'meet' },
    { title: 'Other', value: 'other' },
]

const form = reactive({ title: '', description: '', provider: 'jitsi', join_url: '', starts_at: '', duration_minutes: 60 })
const needsLink = computed(() => form.provider !== 'jitsi')
const attendanceFor = ref<string | null>(null)
const { data: attendees } = useAttendees(attendanceFor)

function fmt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

async function schedule(): Promise<void> {
    if (!form.title.trim() || !form.starts_at) return
    reset()
    try {
        const payload: Record<string, unknown> = {
            title: form.title,
            description: form.description || null,
            provider: form.provider,
            starts_at: new Date(form.starts_at).toISOString(),
            duration_minutes: form.duration_minutes,
        }
        if (needsLink.value) payload.join_url = form.join_url
        await actions.create.mutateAsync(payload)
        form.title = ''
        form.description = ''
        form.join_url = ''
        form.starts_at = ''
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/courses/${courseId}`" class="mb-2">Back to course</v-btn>
        <AppPageHeader title="Live sessions" :subtitle="course?.title" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-card v-if="sessions?.length" class="mb-4">
            <template v-for="(s, i) in sessions" :key="s.id">
                <v-divider v-if="i > 0" />
                <div class="pa-4">
                    <div class="d-flex align-center flex-wrap ga-2">
                        <div>
                            <div class="font-weight-medium">{{ s.title }}</div>
                            <div class="text-caption text-medium-emphasis">{{ fmt(s.starts_at) }} · {{ s.duration_minutes }} min</div>
                        </div>
                        <v-spacer />
                        <LiveProviderBadge :provider="s.provider" />
                        <v-btn :href="s.join_url" target="_blank" size="small" variant="text" prepend-icon="mdi-open-in-new">Link</v-btn>
                        <v-btn size="small" variant="text" prepend-icon="mdi-account-group" @click="attendanceFor = attendanceFor === s.id ? null : s.id">
                            {{ s.attendee_count ?? 0 }}
                        </v-btn>
                        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="actions.remove.mutate(s.id)" />
                    </div>
                    <div v-if="attendanceFor === s.id" class="mt-3">
                        <v-divider class="mb-2" />
                        <div class="text-caption font-weight-bold mb-1">Attendance</div>
                        <div v-if="attendees?.length" class="d-flex flex-wrap ga-2">
                            <v-chip v-for="a in attendees" :key="a.id" size="small" variant="tonal" prepend-icon="mdi-account">{{ a.name }}</v-chip>
                        </div>
                        <p v-else class="text-body-2 text-medium-emphasis mb-0">No one has joined yet.</p>
                    </div>
                </div>
            </template>
        </v-card>

        <AppEmptyState
            v-else-if="!isLoading"
            icon="mdi-video-outline"
            title="No live sessions yet"
            description="Schedule your first session for this course below."
        />

        <!-- Schedule form -->
        <v-card class="pa-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">Schedule a session</div>
            <v-text-field v-model="form.title" label="Title" density="compact" class="mb-2" hide-details />
            <v-textarea v-model="form.description" label="Description (optional)" rows="2" auto-grow density="compact" class="mb-2" hide-details />
            <div class="d-flex flex-wrap ga-2 mb-2">
                <v-select v-model="form.provider" :items="providers" label="Provider" density="compact" hide-details style="min-width: 220px" />
                <v-text-field v-model="form.starts_at" label="Starts at" type="datetime-local" density="compact" hide-details style="min-width: 220px" />
                <v-text-field v-model.number="form.duration_minutes" label="Minutes" type="number" min="5" density="compact" hide-details style="max-width: 120px" />
            </div>
            <v-text-field
                v-if="needsLink"
                v-model="form.join_url"
                label="Join URL"
                placeholder="https://zoom.us/j/…"
                density="compact"
                class="mb-2"
                hide-details
            />
            <p v-else class="text-caption text-medium-emphasis mb-2">A Jitsi room link will be generated automatically.</p>
            <div class="d-flex justify-end">
                <v-btn color="primary" :loading="actions.create.isPending.value" prepend-icon="mdi-video-plus" @click="schedule">Schedule</v-btn>
            </div>
        </v-card>
    </div>
</template>
