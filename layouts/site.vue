<script setup lang="ts">
// Public institution-site layout — no auth, no app chrome.
const route = useRoute()
const institutionSlug = computed(() => route.params.institution as string)
const { data: menu } = usePublicMenu(institutionSlug.value)
</script>

<template>
    <v-app>
        <v-app-bar flat border density="comfortable">
            <v-container class="d-flex align-center py-0">
                <NuxtLink :to="`/site/${institutionSlug}`" class="text-decoration-none text-high-emphasis d-flex align-center ga-2">
                    <v-icon icon="mdi-white-balance-sunny" color="primary" />
                    <span class="text-h6 font-weight-bold">{{ menu?.institution.name ?? 'Site' }}</span>
                </NuxtLink>
                <v-spacer />
                <template v-if="menu">
                    <v-btn
                        v-for="item in menu.items"
                        :key="item.label"
                        :to="item.url.startsWith('/') ? `/site/${institutionSlug}${item.url === '/' ? '' : item.url}` : undefined"
                        :href="item.url.startsWith('/') ? undefined : item.url"
                        variant="text"
                        size="small"
                    >
                        {{ item.label }}
                    </v-btn>
                </template>
                <v-btn :to="`/site/${institutionSlug}/blog`" variant="text" size="small">Blog</v-btn>
            </v-container>
        </v-app-bar>

        <v-main>
            <v-container style="max-width: 820px" class="py-8">
                <slot />
            </v-container>
        </v-main>

        <v-footer class="justify-center text-caption text-medium-emphasis">
            <div>Powered by LUMEN · Learn. Grow. Connect.</div>
        </v-footer>
    </v-app>
</template>
