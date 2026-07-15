<script setup lang="ts">
import type { NetworkSkill } from '~/types/network'

defineProps<{ skill: NetworkSkill; canEndorse?: boolean; removable?: boolean }>()
const emit = defineEmits<{ endorse: []; remove: [] }>()
</script>

<template>
    <v-chip
        size="small"
        :color="skill.endorsed ? 'primary' : undefined"
        :variant="skill.endorsed ? 'tonal' : 'outlined'"
        :closable="removable"
        @click="canEndorse ? emit('endorse') : undefined"
        @click:close="emit('remove')"
    >
        {{ skill.name }}
        <span v-if="skill.endorsement_count > 0" class="ml-1 text-medium-emphasis">· {{ skill.endorsement_count }}</span>
    </v-chip>
</template>
