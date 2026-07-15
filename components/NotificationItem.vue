<script setup lang="ts">
import type { AppNotification } from '~/types/messaging'

const props = defineProps<{ notification: AppNotification }>()

const icons: Record<string, string> = {
    course_completed: 'mdi-school',
    certificate_issued: 'mdi-certificate',
    assignment_graded: 'mdi-clipboard-check',
    new_message: 'mdi-message-text',
    announcement: 'mdi-bullhorn',
}

const icon = computed(() => icons[props.notification.category ?? ''] ?? 'mdi-bell')
const unread = computed(() => props.notification.read_at === null)
const when = computed(() =>
    props.notification.created_at ? new Date(props.notification.created_at).toLocaleString() : '',
)
</script>

<template>
    <div class="d-flex align-start ga-3 py-2">
        <v-avatar :color="unread ? 'primary' : 'surface-variant'" variant="tonal" size="36">
            <v-icon :icon="icon" size="20" />
        </v-avatar>
        <div class="flex-grow-1" style="min-width: 0">
            <div class="d-flex align-center ga-2">
                <span class="text-body-2 font-weight-bold text-truncate">{{ notification.title }}</span>
                <v-icon v-if="unread" icon="mdi-circle" size="8" color="primary" />
            </div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ notification.body }}</p>
            <span class="text-caption text-disabled">{{ when }}</span>
        </div>
    </div>
</template>
