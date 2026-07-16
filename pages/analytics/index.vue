<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()
const isAdmin = computed(() => can('members.manage'))
const isStaff = computed(() => can('courses.update'))

const { data: dashboard, isLoading } = useAnalyticsDashboard()
const { data: courses, isLoading: loadingCourses } = useCourseEngagement()
const { message, handle, reset } = useApiErrors()

const exporting = ref<'courses' | 'revenue' | null>(null)

async function exportCsv(report: 'courses' | 'revenue'): Promise<void> {
    reset()
    exporting.value = report
    try {
        await downloadReport(report)
    } catch (error) {
        handle(error)
    } finally {
        exporting.value = null
    }
}
</script>

<template>
    <div style="max-width: 900px">
        <AppPageHeader title="Analytics" subtitle="How your institution is performing">
            <template v-if="isAdmin" #actions>
                <v-btn
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-download"
                    :loading="exporting === 'courses'"
                    @click="exportCsv('courses')"
                >
                    Courses CSV
                </v-btn>
                <v-btn
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-download"
                    :loading="exporting === 'revenue'"
                    @click="exportCsv('revenue')"
                >
                    Revenue CSV
                </v-btn>
            </template>
        </AppPageHeader>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to view analytics.
        </v-alert>
        <v-alert v-else-if="!isStaff" type="warning" variant="tonal">
            You need staff access to view analytics.
        </v-alert>

        <template v-else>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <v-row v-if="isLoading || loadingCourses" class="mb-1">
                <v-col v-for="i in 4" :key="i" cols="6" md="3">
                    <v-skeleton-loader type="article" class="rounded-xl" />
                </v-col>
            </v-row>

            <!-- Admin KPI cards -->
            <template v-if="isAdmin && dashboard">
                <v-row class="mb-1">
                    <v-col cols="6" md="3"><AppStatCard label="Enrollments" :value="dashboard.enrollments" icon="mdi-account-school" /></v-col>
                    <v-col cols="6" md="3"><AppStatCard label="Completions" :value="dashboard.completions" icon="mdi-check-decagram" color="success" /></v-col>
                    <v-col cols="6" md="3"><AppStatCard label="Completion rate" :value="`${dashboard.completion_rate}%`" icon="mdi-chart-arc" color="secondary" /></v-col>
                    <v-col cols="6" md="3"><AppStatCard label="Active learners (30d)" :value="dashboard.active_learners" icon="mdi-account-clock" color="accent" /></v-col>
                </v-row>

                <div v-if="dashboard.revenue.by_currency.length" class="text-subtitle-2 font-weight-bold mb-2">Revenue</div>
                <v-row v-if="dashboard.revenue.by_currency.length" class="mb-2">
                    <v-col v-for="row in dashboard.revenue.by_currency" :key="row.currency" cols="12" sm="6" md="4">
                        <v-card class="pa-4">
                            <div class="text-caption text-medium-emphasis">{{ row.currency }} · {{ row.count }} paid orders</div>
                            <div class="text-h6 font-weight-bold">{{ formatMoney(row.gross, row.currency) }}</div>
                            <div class="d-flex justify-space-between text-body-2 mt-1">
                                <span class="text-medium-emphasis">Payout</span>
                                <span class="text-success font-weight-bold">{{ formatMoney(row.net_payout, row.currency) }}</span>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <!-- Per-course engagement -->
            <div class="text-subtitle-2 font-weight-bold mb-2">Course engagement</div>
            <v-card v-if="courses?.length">
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th class="text-right">Enrollments</th>
                            <th class="text-right">Completions</th>
                            <th style="width: 220px">Completion rate</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in courses" :key="c.id ?? c.title ?? ''">
                            <td class="font-weight-medium">{{ c.title }}</td>
                            <td class="text-right">{{ c.enrollments }}</td>
                            <td class="text-right">{{ c.completions }}</td>
                            <td>
                                <div class="d-flex align-center ga-2">
                                    <v-progress-linear :model-value="c.completion_rate" color="primary" height="8" rounded style="max-width: 150px" />
                                    <span class="text-caption font-weight-bold">{{ c.completion_rate }}%</span>
                                </div>
                            </td>
                            <td class="text-right">
                                <v-btn v-if="c.id" size="small" variant="text" append-icon="mdi-chevron-right" :to="`/analytics/courses/${c.id}`">
                                    Detail
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <AppEmptyState
                v-else-if="!loadingCourses"
                icon="mdi-chart-line"
                title="No engagement data yet"
                description="Once learners enrol in your courses, engagement appears here."
            />
        </template>
    </div>
</template>
