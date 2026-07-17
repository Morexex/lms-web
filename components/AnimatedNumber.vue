<script setup lang="ts">
// Counts up from zero to `value` the first time it scrolls into view.
const props = withDefaults(defineProps<{ value: number; duration?: number }>(), { duration: 1600 })

const display = ref(0)
const root = ref<HTMLElement | null>(null)

function run(): void {
    const start = performance.now()
    const to = props.value
    function step(now: number): void {
        const t = Math.min((now - start) / props.duration, 1)
        const eased = 1 - (1 - t) ** 3 // easeOutCubic
        display.value = Math.round(to * eased)
        if (t < 1) requestAnimationFrame(step)
        else display.value = to
    }
    requestAnimationFrame(step)
}

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        display.value = props.value
        return
    }
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    run()
                    observer.disconnect()
                }
            }
        },
        { threshold: 0.4 },
    )
    if (root.value) observer.observe(root.value)
})
</script>

<template>
    <span ref="root">{{ display.toLocaleString() }}</span>
</template>
