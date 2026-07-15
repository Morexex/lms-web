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
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-1">Catalog</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">Discover courses to learn.</p>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to browse its catalog.
        </v-alert>

        <template v-else>
            <div class="d-flex flex-wrap ga-3 mb-6">
                <v-text-field
                    v-model="q"
                    label="Search courses"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    hide-details
                    clearable
                    style="min-width: 260px"
                />
                <v-select v-model="level" :items="levels" label="Level" variant="outlined" hide-details style="max-width: 200px" />
            </div>

            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-row>
                <v-col v-for="c in courses" :key="c.id" cols="12" sm="6" md="4">
                    <v-card class="h-100 d-flex flex-column" :to="`/catalog/${c.id}`" hover>
                        <v-sheet color="primary" height="120" class="d-flex align-center justify-center">
                            <v-icon icon="mdi-book-open-variant" color="white" size="40" />
                        </v-sheet>
                        <v-card-item>
                            <div class="text-caption text-medium-emphasis">{{ c.category?.name ?? 'Uncategorised' }}</div>
                            <v-card-title class="text-body-1 font-weight-bold" style="white-space: normal">{{ c.title }}</v-card-title>
                        </v-card-item>
                        <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1">{{ c.summary }}</v-card-text>
                        <v-card-actions>
                            <v-chip size="small" variant="tonal">{{ courseLevelLabel(c.level) }}</v-chip>
                            <v-spacer />
                            <span class="font-weight-bold text-primary">{{ formatPrice(c) }}</span>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col v-if="courses && courses.length === 0" cols="12">
                    <v-alert type="info" variant="tonal">No published courses match your search yet.</v-alert>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
