<script setup lang="ts">
const props = defineProps<{ action: string }>()

// Category by the action's prefix (e.g. "payment.refunded" → payment).
const category = computed(() => props.action.split('.')[0] ?? '')

const color = computed(() => {
    const map: Record<string, string> = {
        auth: 'info',
        payment: 'success',
        billing: 'success',
        platform: 'warning',
        role: 'purple',
        moderation: 'error',
        impersonation: 'error',
    }
    return map[category.value] ?? 'default'
})
</script>

<template>
    <v-chip :color="color" size="x-small" variant="tonal" label>
        <code>{{ action }}</code>
    </v-chip>
</template>
