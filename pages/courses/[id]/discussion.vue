<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: course } = useCourse(courseId)
const { can } = useInstitutionPermissions()
const isStaff = computed(() => can('courses.update'))

const { data: threads, isLoading } = useThreads(courseId)
const selectedId = ref<string | null>(null)
const { data: thread } = useThread(selectedId)
const actions = useDiscussionActions(courseId)
const { data: members } = useMembers()
const { message, handle, reset } = useApiErrors()

const memberItems = computed(() => (members.value ?? []).map((m) => ({ title: m.user.name, value: m.user.id })))

const nt = reactive({ title: '', body: '', mentions: [] as string[] })
async function createThread(): Promise<void> {
    if (!nt.title.trim() || !nt.body.trim()) return
    reset()
    try {
        const created = await actions.createThread.mutateAsync({ ...nt })
        nt.title = ''
        nt.body = ''
        nt.mentions = []
        selectedId.value = created.id
    } catch (error) {
        handle(error)
    }
}

const rb = reactive({ body: '', mentions: [] as string[] })
async function submitReply(): Promise<void> {
    if (!rb.body.trim() || !selectedId.value) return
    reset()
    try {
        await actions.reply.mutateAsync({ threadId: selectedId.value, body: rb.body, mentions: rb.mentions })
        rb.body = ''
        rb.mentions = []
    } catch (error) {
        handle(error)
    }
}

function fmt(iso: string | null): string {
    return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : ''
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/courses/${courseId}`" class="mb-2">Back to course</v-btn>
        <AppPageHeader title="Discussion" :subtitle="course?.title" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <!-- Thread detail -->
        <template v-if="selectedId && thread">
            <v-btn variant="text" size="small" prepend-icon="mdi-arrow-left" class="mb-2" @click="selectedId = null">All threads</v-btn>
            <v-card class="pa-4 mb-3">
                <div class="d-flex align-center flex-wrap ga-2 mb-2">
                    <v-icon v-if="thread.is_pinned" icon="mdi-pin" size="small" color="primary" />
                    <v-icon v-if="thread.is_locked" icon="mdi-lock" size="small" color="warning" />
                    <h2 class="text-h6 font-weight-bold">{{ thread.title }}</h2>
                    <v-chip v-if="thread.is_hidden" size="x-small" color="error" variant="tonal">hidden</v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mb-2">{{ thread.author?.name }} · {{ fmt(thread.created_at) }}</div>
                <p class="text-body-1 mb-3" style="white-space: pre-wrap">{{ thread.body }}</p>
                <ReactionBar :reactions="thread.reactions ?? []" @toggle="(e) => actions.reactThread.mutate({ id: thread!.id, emoji: e })" />

                <!-- Staff moderation -->
                <div v-if="isStaff" class="d-flex flex-wrap ga-1 mt-3">
                    <v-btn size="x-small" variant="tonal" @click="actions.moderateThread.mutate({ id: thread.id, data: { is_pinned: !thread.is_pinned } })">
                        {{ thread.is_pinned ? 'Unpin' : 'Pin' }}
                    </v-btn>
                    <v-btn size="x-small" variant="tonal" @click="actions.moderateThread.mutate({ id: thread.id, data: { is_locked: !thread.is_locked } })">
                        {{ thread.is_locked ? 'Unlock' : 'Lock' }}
                    </v-btn>
                    <v-btn size="x-small" variant="tonal" @click="actions.moderateThread.mutate({ id: thread.id, data: { is_hidden: !thread.is_hidden } })">
                        {{ thread.is_hidden ? 'Unhide' : 'Hide' }}
                    </v-btn>
                    <v-btn size="x-small" variant="text" color="error" @click="actions.removeThread.mutate(thread.id); selectedId = null">Remove</v-btn>
                </div>
            </v-card>

            <!-- Replies -->
            <v-card v-for="r in thread.replies ?? []" :key="r.id" class="pa-4 mb-2" variant="outlined" :class="{ 'opacity-60': r.is_hidden }">
                <div class="text-caption text-medium-emphasis mb-1">
                    {{ r.author?.name }} · {{ fmt(r.created_at) }}
                    <v-chip v-if="r.is_hidden" size="x-small" color="error" variant="tonal" class="ml-1">hidden</v-chip>
                </div>
                <p class="text-body-2 mb-2" style="white-space: pre-wrap">{{ r.body }}</p>
                <div class="d-flex align-center justify-space-between">
                    <ReactionBar :reactions="r.reactions ?? []" @toggle="(e) => actions.reactReply.mutate({ id: r.id, emoji: e })" />
                    <div v-if="isStaff" class="d-flex ga-1">
                        <v-btn size="x-small" variant="text" @click="actions.moderateReply.mutate({ id: r.id, is_hidden: !r.is_hidden })">
                            {{ r.is_hidden ? 'Unhide' : 'Hide' }}
                        </v-btn>
                        <v-btn size="x-small" variant="text" color="error" @click="actions.removeReply.mutate(r.id)">Remove</v-btn>
                    </div>
                </div>
            </v-card>

            <!-- Reply form -->
            <v-card v-if="!thread.is_locked" class="pa-4 mt-3">
                <v-textarea v-model="rb.body" label="Write a reply" rows="2" auto-grow density="compact" class="mb-2" hide-details />
                <div class="d-flex flex-wrap ga-2 align-center">
                    <v-autocomplete v-model="rb.mentions" :items="memberItems" label="Mention" multiple chips closable-chips density="compact" hide-details style="min-width: 220px" />
                    <v-spacer />
                    <v-btn color="primary" :loading="actions.reply.isPending.value" @click="submitReply">Reply</v-btn>
                </div>
            </v-card>
            <v-alert v-else type="info" variant="tonal" density="compact" class="mt-3">This thread is locked.</v-alert>
        </template>

        <!-- Thread list + new thread -->
        <template v-else>
            <v-card v-if="threads?.length" class="mb-4">
                <v-list>
                    <v-list-item v-for="t in threads" :key="t.id" @click="selectedId = t.id">
                        <template #prepend>
                            <v-icon :icon="t.is_pinned ? 'mdi-pin' : 'mdi-comment-question-outline'" :color="t.is_pinned ? 'primary' : undefined" />
                        </template>
                        <v-list-item-title class="font-weight-medium">
                            {{ t.title }}
                            <v-icon v-if="t.is_locked" icon="mdi-lock" size="x-small" class="ml-1" />
                            <v-chip v-if="t.is_hidden" size="x-small" color="error" variant="tonal" class="ml-1">hidden</v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ t.author?.name }} · {{ t.reply_count ?? 0 }} replies</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card>
            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-forum-outline"
                title="No discussions yet"
                description="Start the conversation by posting the first question below."
            />

            <v-card class="pa-4">
                <div class="text-subtitle-2 font-weight-bold mb-2">Ask a question</div>
                <v-text-field v-model="nt.title" label="Title" density="compact" class="mb-2" hide-details />
                <v-textarea v-model="nt.body" label="Details" rows="3" auto-grow density="compact" class="mb-2" hide-details />
                <div class="d-flex flex-wrap ga-2 align-center">
                    <v-autocomplete v-model="nt.mentions" :items="memberItems" label="Mention (optional)" multiple chips closable-chips density="compact" hide-details style="min-width: 220px" />
                    <v-spacer />
                    <v-btn color="primary" :loading="actions.createThread.isPending.value" @click="createThread">Post</v-btn>
                </div>
            </v-card>
        </template>
    </div>
</template>
