<script setup lang="ts">
import type { AppNotification } from '~/types/messaging'

const { data: unread } = useUnreadCount()
const { data: notifications } = useNotifications()
const { markRead, markAllRead } = useNotificationActions()

const recent = computed(() => (notifications.value ?? []).slice(0, 8))
const badge = computed(() => unread.value ?? 0)

async function open(n: AppNotification): Promise<void> {
    if (n.read_at === null) await markRead.mutateAsync(n.id)
    if (n.action_url) await navigateTo(n.action_url, { external: true })
}
</script>

<template>
    <v-menu :close-on-content-click="false" location="bottom end">
        <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" aria-label="Notifications">
                <v-badge :model-value="badge > 0" :content="badge" color="error" max="99">
                    <v-icon icon="mdi-bell-outline" />
                </v-badge>
            </v-btn>
        </template>

        <v-card min-width="360" max-width="420">
            <div class="d-flex align-center px-4 py-2">
                <span class="text-subtitle-2 font-weight-bold">Notifications</span>
                <v-spacer />
                <v-btn v-if="badge > 0" size="small" variant="text" @click="markAllRead.mutate()">Mark all read</v-btn>
            </div>
            <v-divider />

            <div v-if="recent.length" style="max-height: 420px; overflow-y: auto">
                <div
                    v-for="n in recent"
                    :key="n.id"
                    class="px-4"
                    style="cursor: pointer"
                    :class="{ 'bg-surface-variant': n.read_at === null }"
                    @click="open(n)"
                >
                    <NotificationItem :notification="n" />
                    <v-divider />
                </div>
            </div>
            <div v-else class="text-center text-body-2 text-medium-emphasis py-8">You're all caught up.</div>

            <v-divider />
            <v-btn block variant="text" to="/notifications" class="text-none">See all notifications</v-btn>
        </v-card>
    </v-menu>
</template>
