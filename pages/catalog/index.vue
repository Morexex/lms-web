<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const institution = useInstitutionStore()
const q = ref('')
const level = ref('')
const { data: courses, isLoading } = useCatalog({ q, level })

const levels = [
    { title: 'All levels', value: '' },
    { title: 'Beginner', value: 'beginner' },
    { title: 'Intermediate', value: 'intermediate' },
    { title: 'Advanced', value: 'advanced' },
]

/** Soft gradient fallbacks so cover-less courses still feel designed. */
const gradients = [
    'linear-gradient(120deg, #0F766E, #134E4A)',
    'linear-gradient(120deg, #1D4ED8, #1E3A8A)',
    'linear-gradient(120deg, #0F766E, #1D4ED8)',
]
function coverGradient(id: string): string {
    return gradients[id.charCodeAt(id.length - 1) % gradients.length]!
}
</script>

<template>
    <div>
        <AppPageHeader title="Catalog" subtitle="Find your next course" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to browse its catalog.
        </v-alert>

        <template v-else>
            <div class="d-flex flex-wrap ga-3 mb-6">
                <v-text-field
                    v-model="q"
                    label="Search courses"
                    prepend-inner-icon="mdi-magnify"
                    hide-details
                    clearable
                    style="min-width: 260px; max-width: 420px"
                />
                <v-select v-model="level" :items="levels" label="Level" hide-details style="max-width: 200px" />
            </div>

            <!-- Content-shaped loading -->
            <v-row v-if="isLoading">
                <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
                    <v-skeleton-loader type="image, article" class="rounded-xl" />
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col v-for="c in courses" :key="c.id" cols="12" sm="6" md="4">
                    <v-card class="h-100 d-flex flex-column" :to="`/catalog/${c.id}`">
                        <!-- Cover with floating level chip -->
                        <div class="position-relative">
                            <v-img v-if="c.cover_image_url" :src="c.cover_image_url" height="140" cover />
                            <div
                                v-else
                                class="d-flex align-center justify-center"
                                :style="{ height: '140px', background: coverGradient(c.id) }"
                            >
                                <v-icon icon="mdi-book-open-page-variant" color="rgba(255,255,255,.85)" size="44" />
                            </div>
                            <v-chip
                                size="small"
                                variant="flat"
                                color="surface"
                                class="position-absolute font-weight-medium"
                                style="top: 10px; left: 10px"
                            >
                                {{ courseLevelLabel(c.level) }}
                            </v-chip>
                        </div>

                        <v-card-item class="pb-0">
                            <div class="text-caption text-primary font-weight-medium">{{ c.category?.name ?? 'General' }}</div>
                            <v-card-title class="text-body-1 font-weight-bold px-0" style="white-space: normal; line-height: 1.35">
                                {{ c.title }}
                            </v-card-title>
                        </v-card-item>
                        <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1 pt-2">
                            {{ c.summary }}
                        </v-card-text>
                        <v-divider />
                        <v-card-actions class="px-4">
                            <span
                                class="font-weight-bold"
                                :class="c.is_free ? 'text-success' : 'text-primary'"
                            >
                                {{ formatPrice(c) }}
                            </span>
                            <v-spacer />
                            <span class="text-caption text-medium-emphasis d-flex align-center">
                                View course <v-icon icon="mdi-chevron-right" size="small" />
                            </span>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <v-col v-if="courses && courses.length === 0" cols="12">
                    <v-card>
                        <AppEmptyState
                            icon="mdi-book-search-outline"
                            title="No courses match"
                            description="Try a different search or level — new courses are published all the time."
                        />
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
