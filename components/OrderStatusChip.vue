<script setup lang="ts">
const props = defineProps<{ status: string }>()

const meta: Record<string, { color: string; label: string }> = {
    pending: { color: 'grey', label: 'Pending' },
    processing: { color: 'info', label: 'Processing' },
    paid: { color: 'success', label: 'Paid' },
    failed: { color: 'error', label: 'Failed' },
    refunded: { color: 'warning', label: 'Refunded' },
}

const chip = computed(() => meta[props.status] ?? { color: 'grey', label: props.status })
</script>

<template>
    <v-chip :color="chip.color" size="small" variant="tonal">{{ chip.label }}</v-chip>
</template>
