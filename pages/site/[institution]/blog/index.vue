<script setup lang="ts">
// Public blog index.
definePageMeta({ layout: 'site' })

const route = useRoute()
const institutionSlug = route.params.institution as string
const { data: posts, isLoading } = usePublicPosts(institutionSlug)

useSeoMeta({ title: 'Blog', description: 'Latest posts and news.' })

function formatDate(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''
}
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-6">Blog</h1>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <template v-if="posts?.length">
            <NuxtLink
                v-for="post in posts"
                :key="post.slug"
                :to="`/site/${institutionSlug}/blog/${post.slug}`"
                class="text-decoration-none text-high-emphasis"
            >
                <v-card class="pa-5 mb-4" variant="outlined" hover>
                    <div class="text-caption text-medium-emphasis mb-1">{{ formatDate(post.published_at) }}</div>
                    <h2 class="text-h6 font-weight-bold mb-1">{{ post.title }}</h2>
                    <p v-if="post.seo_description" class="text-body-2 text-medium-emphasis mb-0">{{ post.seo_description }}</p>
                </v-card>
            </NuxtLink>
        </template>

        <p v-else-if="!isLoading" class="text-body-1 text-medium-emphasis">No posts published yet.</p>
    </div>
</template>
