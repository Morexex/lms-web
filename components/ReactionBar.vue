<script setup lang="ts">
import type { ReactionSummary } from '~/types/community'

defineProps<{ reactions: ReactionSummary[] }>()
const emit = defineEmits<{ toggle: [emoji: string] }>()

const palette = ['👍', '❤️', '🎉', '😄', '🙏', '👀']
</script>

<template>
    <div class="d-flex align-center flex-wrap ga-1">
        <v-chip
            v-for="r in reactions"
            :key="r.emoji"
            size="small"
            :color="r.reacted ? 'primary' : undefined"
            :variant="r.reacted ? 'tonal' : 'outlined'"
            @click="emit('toggle', r.emoji)"
        >
            {{ r.emoji }} {{ r.count }}
        </v-chip>

        <v-menu>
            <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-emoticon-plus-outline" size="x-small" variant="text" aria-label="Add reaction" />
            </template>
            <v-list density="compact">
                <v-list-item v-for="e in palette" :key="e" @click="emit('toggle', e)">
                    <span class="text-h6">{{ e }}</span>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
