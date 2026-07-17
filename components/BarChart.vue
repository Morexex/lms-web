<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        items: Array<{ label: string; value: number }>
        color?: string
        emptyText?: string
    }>(),
    { color: 'rgb(var(--v-theme-primary))', emptyText: 'No data yet.' },
)

const max = computed(() => Math.max(...props.items.map((i) => i.value), 1))

function widthFor(value: number): string {
    return `${Math.max((value / max.value) * 100, value > 0 ? 4 : 0)}%`
}
</script>

<template>
    <div>
        <p v-if="!items.length" class="text-body-2 text-medium-emphasis mb-0">{{ emptyText }}</p>
        <div v-for="item in items" :key="item.label" class="d-flex align-center ga-2 mb-2">
            <span class="text-caption text-medium-emphasis text-truncate" style="width: 110px; flex-shrink: 0">
                {{ item.label }}
            </span>
            <div class="flex-grow-1 rounded" style="height: 14px; background: rgba(var(--v-theme-on-surface), 0.08)">
                <div
                    class="rounded"
                    :style="{ width: widthFor(item.value), height: '14px', background: color, transition: 'width .3s' }"
                    :data-testid="`bar-${item.label}`"
                />
            </div>
            <span class="text-caption font-weight-bold" style="width: 32px; text-align: right">{{ item.value }}</span>
        </div>
    </div>
</template>
