<script setup lang="ts">
defineProps<{
    label: string
    value: string | number
    icon: string
    color?: string
}>()
</script>

<template>
    <v-card class="pa-5">
        <div class="d-flex align-center justify-space-between">
            <div>
                <p class="text-caption text-medium-emphasis text-uppercase mb-1">{{ label }}</p>
                <p class="text-h5 font-weight-bold mb-0">{{ value }}</p>
            </div>
            <v-avatar :color="color ?? 'primary'" variant="tonal" size="48">
                <v-icon :icon="icon" />
            </v-avatar>
        </div>
    </v-card>
</template>
