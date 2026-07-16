<script setup lang="ts">
// Public site home — renders the "home" page if one is published.
definePageMeta({ layout: 'site' })

const route = useRoute()
const institutionSlug = route.params.institution as string
const { data: page, isLoading, isError } = usePublicPage(institutionSlug, 'home')

useSeoMeta({
    title: () => page.value?.seo_title ?? page.value?.title ?? 'Home',
    description: () => page.value?.seo_description ?? undefined,
})
</script>

<template>
    <div>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <template v-if="page">
            <h1 class="text-h4 font-weight-bold mb-4">{{ page.title }}</h1>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="text-body-1" v-html="page.body" />
        </template>

        <div v-else-if="isError" class="text-center py-12">
            <v-icon icon="mdi-white-balance-sunny" color="primary" size="56" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-2">Welcome</h1>
            <p class="text-body-1 text-medium-emphasis mb-4">This academy hasn't published a home page yet.</p>
            <v-btn :to="`/site/${institutionSlug}/blog`" color="primary" variant="tonal">Read the blog</v-btn>
        </div>
    </div>
</template>
