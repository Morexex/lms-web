<script setup lang="ts">
withDefaults(
    defineProps<{
        icon?: string
        title: string
        description?: string
    }>(),
    { icon: 'mdi-inbox-outline' },
)
</script>

<template>
    <div class="d-flex flex-column align-center text-center py-12 px-6">
        <v-avatar size="64" color="primary" variant="tonal" class="mb-4">
            <v-icon :icon="icon" size="32" />
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-1">{{ title }}</h3>
        <p v-if="description" class="text-body-2 text-medium-emphasis mb-4" style="max-width: 360px">
            {{ description }}
        </p>
        <slot name="action" />
    </div>
</template>
