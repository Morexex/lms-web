<script setup lang="ts">
// Public landing page by slug.
definePageMeta({ layout: 'site' })

const route = useRoute()
const institutionSlug = route.params.institution as string
const slug = route.params.slug as string
const { data: page, isLoading, isError } = usePublicPage(institutionSlug, slug)

useSeoMeta({
    title: () => page.value?.seo_title ?? page.value?.title ?? 'Page',
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
            <v-icon icon="mdi-file-remove-outline" color="medium-emphasis" size="56" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-2">Page not found</h1>
            <p class="text-body-1 text-medium-emphasis mb-4">This page doesn't exist or hasn't been published.</p>
            <v-btn :to="`/site/${institutionSlug}`" color="primary" variant="tonal">Back to home</v-btn>
        </div>
    </div>
</template>
