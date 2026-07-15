<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const institution = useInstitutionStore()
const { data: enrollments, isLoading } = useMyEnrollments()
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-1">My learning</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">Courses you're enrolled in.</p>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to see your courses.
        </v-alert>

        <template v-else>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-row>
                <v-col v-for="e in enrollments" :key="e.id" cols="12" sm="6" md="4">
                    <v-card class="h-100 d-flex flex-column" :to="`/learn/${e.course.id}`" hover>
                        <v-sheet color="primary" height="100" class="d-flex align-center justify-center">
                            <v-icon icon="mdi-play-circle" color="white" size="40" />
                        </v-sheet>
                        <v-card-item>
                            <v-card-title class="text-body-1 font-weight-bold" style="white-space: normal">{{ e.course.title }}</v-card-title>
                        </v-card-item>
                        <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1">{{ e.course.summary }}</v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" variant="text">Continue learning</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col v-if="enrollments && enrollments.length === 0" cols="12">
                    <v-alert type="info" variant="tonal">
                        You haven't enrolled in any courses yet.
                        <NuxtLink to="/catalog" class="text-primary text-decoration-none font-weight-medium">Browse the catalog</NuxtLink>.
                    </v-alert>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
