<script setup lang="ts">
// Public blog post by slug.
definePageMeta({ layout: 'site' })

const route = useRoute()
const institutionSlug = route.params.institution as string
const slug = route.params.slug as string
const { data: post, isLoading, isError } = usePublicPost(institutionSlug, slug)

useSeoMeta({
    title: () => post.value?.seo_title ?? post.value?.title ?? 'Post',
    description: () => post.value?.seo_description ?? undefined,
})

function formatDate(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''
}
</script>

<template>
    <div>
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/site/${institutionSlug}/blog`" class="mb-4">All posts</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <template v-if="post">
            <div class="text-caption text-medium-emphasis mb-1">{{ formatDate(post.published_at) }}</div>
            <h1 class="text-h4 font-weight-bold mb-4">{{ post.title }}</h1>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="text-body-1" v-html="post.body" />
        </template>

        <div v-else-if="isError" class="text-center py-12">
            <v-icon icon="mdi-file-remove-outline" color="medium-emphasis" size="56" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-2">Post not found</h1>
            <p class="text-body-1 text-medium-emphasis mb-4">This post doesn't exist or hasn't been published.</p>
            <v-btn :to="`/site/${institutionSlug}/blog`" color="primary" variant="tonal">Back to blog</v-btn>
        </div>
    </div>
</template>
