<script setup lang="ts">
const { preference, isDark, apply } = useAppTheme()

// Apply the cookie's theme during SSR so there is never a flash
apply(preference.value)

// Drive Tailwind's dark: variants from the same source of truth
useHead({
    htmlAttrs: { class: computed(() => (isDark.value ? 'dark' : '')) },
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
