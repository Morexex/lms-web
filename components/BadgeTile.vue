<script setup lang="ts">
import type { EarnedBadge } from '~/types/gamification'

const props = defineProps<{ badge: EarnedBadge }>()

const icons: Record<string, string> = {
    first_course: 'mdi-school',
    course_champion: 'mdi-trophy',
    community_voice: 'mdi-forum',
    week_streak: 'mdi-fire',
    month_streak: 'mdi-calendar-star',
    rising_star: 'mdi-star-shooting',
}

const icon = computed(() => icons[props.badge.badge] ?? 'mdi-medal')
const when = computed(() =>
    new Date(props.badge.awarded_at).toLocaleDateString(undefined, { dateStyle: 'medium' }),
)
</script>

<template>
    <v-card class="pa-4 text-center h-100" variant="outlined">
        <v-avatar size="52" color="accent" variant="tonal" class="mb-2">
            <v-icon :icon="icon" size="28" />
        </v-avatar>
        <div class="text-subtitle-2 font-weight-bold">{{ badge.label }}</div>
        <p class="text-caption text-medium-emphasis mb-1">{{ badge.description }}</p>
        <span class="text-caption text-disabled">Earned {{ when }}</span>
    </v-card>
</template>
