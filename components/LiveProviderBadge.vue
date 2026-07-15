<script setup lang="ts">
import type { LiveProvider } from '~/types/live-sessions'

const props = defineProps<{ provider: LiveProvider }>()

const meta: Record<LiveProvider, { label: string; icon: string; color: string }> = {
    zoom: { label: 'Zoom', icon: 'mdi-video', color: 'blue' },
    meet: { label: 'Google Meet', icon: 'mdi-google', color: 'green' },
    jitsi: { label: 'Jitsi', icon: 'mdi-video-account', color: 'primary' },
    other: { label: 'Other', icon: 'mdi-link-variant', color: 'grey' },
}

const badge = computed(() => meta[props.provider] ?? meta.other)
</script>

<template>
    <v-chip :color="badge.color" size="small" variant="tonal" :prepend-icon="badge.icon">
        {{ badge.label }}
    </v-chip>
</template>
