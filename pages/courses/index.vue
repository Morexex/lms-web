<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()
const { data: courses, isLoading } = useCourses()
const status = useCourseStatus()

const statusColor = (s: string): string =>
    s === 'published' ? 'success' : s === 'archived' ? 'grey' : 'warning'
</script>

<template>
    <div>
        <div class="d-flex align-center mb-6">
            <div>
                <h1 class="text-h4 font-weight-bold">Courses</h1>
                <p class="text-body-1 text-medium-emphasis">Manage your institution's catalog.</p>
            </div>
            <v-spacer />
            <v-btn v-if="can('courses.create')" color="primary" prepend-icon="mdi-plus" to="/courses/create">
                New course
            </v-btn>
        </div>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to manage its courses.
        </v-alert>

        <v-card v-else>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" />
            <v-table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Level</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="c in courses" :key="c.id">
                        <td class="font-weight-medium">{{ c.title }}</td>
                        <td>{{ courseLevelLabel(c.level) }}</td>
                        <td>{{ formatPrice(c) }}</td>
                        <td><v-chip :color="statusColor(c.status)" size="small" variant="tonal">{{ c.status }}</v-chip></td>
                        <td class="text-right">
                            <v-btn size="small" variant="text" :to="`/courses/${c.id}`">Edit</v-btn>
                            <template v-if="can('courses.publish')">
                                <v-btn
                                    v-if="c.status !== 'published'"
                                    size="small"
                                    variant="text"
                                    color="success"
                                    @click="status.mutate({ id: c.id, action: 'publish' })"
                                >
                                    Publish
                                </v-btn>
                                <v-btn
                                    v-else
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    @click="status.mutate({ id: c.id, action: 'unpublish' })"
                                >
                                    Unpublish
                                </v-btn>
                            </template>
                        </td>
                    </tr>
                    <tr v-if="courses && courses.length === 0">
                        <td colspan="5" class="text-center text-medium-emphasis py-6">No courses yet.</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>
