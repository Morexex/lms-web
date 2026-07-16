<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const institution = useInstitutionStore()
const { data: enrollments, isLoading } = useMyEnrollments()

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
        <AppPageHeader title="My learning" subtitle="Courses you're enrolled in" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to see your courses.
        </v-alert>

        <template v-else>
            <v-row v-if="isLoading">
                <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4">
                    <v-skeleton-loader type="image, article" class="rounded-xl" />
                </v-col>
            </v-row>

            <v-row v-else>
                <v-col v-for="e in enrollments" :key="e.id" cols="12" sm="6" md="4">
                    <v-card class="h-100 d-flex flex-column" :to="`/learn/${e.course.id}`">
                        <div
                            class="d-flex align-center justify-center position-relative"
                            :style="{ height: '110px', background: coverGradient(e.course.id) }"
                        >
                            <v-icon
                                :icon="e.completed_at ? 'mdi-check-decagram' : 'mdi-play-circle'"
                                color="rgba(255,255,255,.9)"
                                size="42"
                            />
                            <v-chip
                                v-if="e.completed_at"
                                size="small"
                                color="surface"
                                variant="flat"
                                prepend-icon="mdi-check"
                                class="position-absolute font-weight-medium"
                                style="top: 10px; right: 10px"
                            >
                                Completed
                            </v-chip>
                        </div>
                        <v-card-item>
                            <v-card-title class="text-body-1 font-weight-bold px-0" style="white-space: normal; line-height: 1.35">
                                {{ e.course.title }}
                            </v-card-title>
                        </v-card-item>
                        <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1 pt-0">
                            {{ e.course.summary }}
                        </v-card-text>
                        <div class="px-4 pb-2">
                            <div class="d-flex align-center justify-space-between mb-1">
                                <span class="text-caption text-medium-emphasis">{{ e.completed_at ? 'Completed' : 'Progress' }}</span>
                                <span class="text-caption font-weight-bold" :class="e.completed_at ? 'text-success' : 'text-primary'">
                                    {{ e.progress }}%
                                </span>
                            </div>
                            <v-progress-linear
                                :model-value="e.progress"
                                :color="e.completed_at ? 'success' : 'primary'"
                                height="6"
                                rounded
                            />
                        </div>
                        <v-card-actions class="px-4">
                            <v-btn color="primary" variant="text" :append-icon="e.completed_at ? undefined : 'mdi-arrow-right'">
                                {{ e.completed_at ? 'Review course' : 'Continue learning' }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <v-col v-if="enrollments && enrollments.length === 0" cols="12">
                    <v-card>
                        <AppEmptyState
                            icon="mdi-school-outline"
                            title="Your learning journey starts here"
                            description="You haven't enrolled in any courses yet — find one that excites you."
                        >
                            <template #action>
                                <v-btn color="primary" to="/catalog" prepend-icon="mdi-book-open-variant">Browse catalog</v-btn>
                            </template>
                        </AppEmptyState>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
