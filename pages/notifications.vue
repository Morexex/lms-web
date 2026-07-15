<script setup lang="ts">
import type { NotificationPreference } from '~/types/messaging'

definePageMeta({ middleware: 'auth' })

const { data: notifications, isLoading } = useNotifications()
const { markRead, markAllRead } = useNotificationActions()
const { data: preferences } = usePreferences()
const updatePreferences = useUpdatePreferences()

const tab = ref<'inbox' | 'preferences'>('inbox')

// Local editable copy of the preference toggles.
const draft = ref<NotificationPreference[]>([])
watch(preferences, (value) => { if (value) draft.value = value.map((p) => ({ ...p })) }, { immediate: true })

const hasUnread = computed(() => (notifications.value ?? []).some((n) => n.read_at === null))

async function savePreferences(): Promise<void> {
    await updatePreferences.mutateAsync(
        draft.value.map((p) => ({ category: p.category, in_app: p.in_app, email: p.email })),
    )
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="Notifications" subtitle="Your alerts and delivery preferences" />

        <v-tabs v-model="tab" color="primary" class="mb-4">
            <v-tab value="inbox">Inbox</v-tab>
            <v-tab value="preferences">Preferences</v-tab>
        </v-tabs>

        <!-- Inbox -->
        <template v-if="tab === 'inbox'">
            <div v-if="hasUnread" class="d-flex justify-end mb-2">
                <v-btn size="small" variant="text" prepend-icon="mdi-check-all" @click="markAllRead.mutate()">
                    Mark all read
                </v-btn>
            </div>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" />

            <v-card v-if="notifications?.length">
                <div v-for="n in notifications" :key="n.id" class="px-4" :class="{ 'bg-surface-variant': n.read_at === null }">
                    <div class="d-flex align-center">
                        <div class="flex-grow-1"><NotificationItem :notification="n" /></div>
                        <v-btn v-if="n.read_at === null" size="x-small" variant="text" @click="markRead.mutate(n.id)">
                            Mark read
                        </v-btn>
                    </div>
                    <v-divider />
                </div>
            </v-card>

            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-bell-outline"
                title="No notifications yet"
                description="Alerts about your courses, messages, and certificates will appear here."
            />
        </template>

        <!-- Preferences -->
        <template v-else>
            <v-card class="pa-2">
                <v-table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th class="text-center" style="width: 100px">In-app</th>
                            <th class="text-center" style="width: 100px">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in draft" :key="p.category">
                            <td>
                                <div class="font-weight-medium">{{ p.label }}</div>
                                <div class="text-caption text-medium-emphasis">{{ p.description }}</div>
                            </td>
                            <td class="text-center">
                                <v-switch v-model="p.in_app" color="primary" density="compact" hide-details inset class="d-inline-flex" />
                            </td>
                            <td class="text-center">
                                <v-switch v-model="p.email" color="primary" density="compact" hide-details inset class="d-inline-flex" />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
                <div class="d-flex justify-end pa-3">
                    <v-btn color="primary" :loading="updatePreferences.isPending.value" @click="savePreferences">
                        Save preferences
                    </v-btn>
                </div>
            </v-card>
        </template>
    </div>
</template>
