<script setup lang="ts">
const props = defineProps<{
    title: string
    url: string
    description?: string | null
}>()

const shownDescription = computed(() =>
    props.description?.trim() || 'Add an SEO description to control how this looks in search results.',
)
</script>

<template>
    <div class="pa-3 rounded-lg" style="border: 1px dashed rgba(var(--v-theme-on-surface), 0.2)">
        <div class="text-caption text-success text-truncate">{{ url }}</div>
        <div class="text-subtitle-2 font-weight-medium text-info text-truncate">{{ title }}</div>
        <p class="text-caption text-medium-emphasis mb-0" style="max-width: 60ch">{{ shownDescription }}</p>
    </div>
</template>
