<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()
const { data: announcements, isLoading } = useAnnouncements()
const announce = useAnnounceInstitution()
const { message, handle, reset } = useApiErrors()

const title = ref('')
const body = ref('')
const sent = ref(false)

async function post(): Promise<void> {
    if (!title.value.trim() || !body.value.trim()) return
    reset()
    sent.value = false
    try {
        await announce.mutateAsync({ title: title.value, body: body.value })
        title.value = ''
        body.value = ''
        sent.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="Announcements" subtitle="Broadcast to everyone in your institution" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to post announcements.
        </v-alert>

        <template v-else>
            <v-card v-if="can('members.manage')" class="pa-4 mb-6">
                <div class="text-subtitle-2 font-weight-bold mb-2">New institution announcement</div>
                <v-alert v-if="sent" type="success" variant="tonal" density="compact" class="mb-3">Announcement sent.</v-alert>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
                <v-text-field v-model="title" label="Title" density="compact" class="mb-2" hide-details />
                <v-textarea v-model="body" label="Message" rows="3" auto-grow density="compact" class="mb-3" hide-details />
                <div class="d-flex justify-end">
                    <v-btn color="primary" :loading="announce.isPending.value" prepend-icon="mdi-bullhorn" @click="post">
                        Send to everyone
                    </v-btn>
                </div>
            </v-card>

            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <div class="text-subtitle-2 font-weight-bold mb-2">Sent announcements</div>
            <v-card v-if="announcements?.length">
                <v-list>
                    <v-list-item v-for="a in announcements" :key="a.id">
                        <template #prepend>
                            <v-avatar :color="a.scope === 'course' ? 'secondary' : 'primary'" variant="tonal">
                                <v-icon :icon="a.scope === 'course' ? 'mdi-book-open-variant' : 'mdi-bullhorn'" />
                            </v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">{{ a.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ a.body }}</v-list-item-subtitle>
                        <template #append>
                            <div class="text-caption text-medium-emphasis text-right">
                                <v-chip size="x-small" variant="tonal" class="mb-1">{{ a.scope }}</v-chip>
                                <div>{{ a.author?.name }}</div>
                            </div>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-bullhorn-outline"
                title="No announcements yet"
                description="Posts to your institution or courses will show up here."
            />
        </template>
    </div>
</template>
