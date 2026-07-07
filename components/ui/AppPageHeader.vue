<script setup lang="ts">
defineProps<{
    title: string
    subtitle?: string
}>()
</script>

<template>
    <header class="d-flex flex-wrap align-center justify-space-between ga-4 mb-8">
        <div>
            <h1 class="text-h4 font-weight-bold">{{ title }}</h1>
            <p v-if="subtitle" class="text-body-1 text-medium-emphasis mt-1 mb-0">
                {{ subtitle }}
            </p>
        </div>
        <div v-if="$slots.actions" class="d-flex ga-2">
            <slot name="actions" />
        </div>
    </header>
</template>
