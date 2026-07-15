<script setup lang="ts">
const props = withDefaults(defineProps<{ value?: number; max?: number; editable?: boolean }>(), {
    value: 0,
    max: 5,
    editable: false,
})
const emit = defineEmits<{ 'update:value': [stars: number] }>()

function set(n: number): void {
    if (props.editable) emit('update:value', n)
}
</script>

<template>
    <div class="d-inline-flex align-center">
        <v-icon
            v-for="n in max"
            :key="n"
            :icon="n <= value ? 'mdi-star' : 'mdi-star-outline'"
            color="amber"
            :size="editable ? 28 : 18"
            :style="editable ? 'cursor: pointer' : ''"
            @click="set(n)"
        />
    </div>
</template>
