<script setup lang="ts">
const { can } = useInstitutionPermissions()

const { data: dashboard, isLoading: loadingStats } = useAnalyticsDashboard()
const { data: engagement, isLoading: loadingCourses } = useCourseEngagement()
const { data: members, isLoading: loadingMembers } = useMembers()
const { data: orders } = useInstitutionOrders()

/** Top courses by enrolment — the ones worth watching. */
const topCourses = computed(() =>
    [...(engagement.value ?? [])].sort((a, b) => b.enrollments - a.enrollments).slice(0, 5),
)
const recentMembers = computed(() => (members.value ?? []).slice(0, 5))
const recentOrders = computed(() => (orders.value ?? []).slice(0, 5))
const revenue = computed(() => dashboard.value?.revenue ?? null)

const quickActions = [
    { title: 'New course', icon: 'mdi-plus-box', to: '/courses/create', show: can('courses.update') },
    { title: 'Invite people', icon: 'mdi-account-plus-outline', to: '/people', show: can('members.invite') },
    { title: 'Website', icon: 'mdi-web', to: '/manage/cms', show: can('members.manage') },
    { title: 'Full analytics', icon: 'mdi-chart-box-outline', to: '/analytics', show: can('courses.update') },
].filter((a) => a.show)

function initials(name: string): string {
    return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}
function roleLabel(roles: string[]): string {
    return (roles[0] ?? 'member').replace('_', ' ')
}
function fmtDate(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
}
</script>

<template>
    <div class="d-flex flex-column ga-6">
        <!-- ============ KPI row ============ -->
        <v-row v-if="loadingStats">
            <v-col v-for="i in 4" :key="i" cols="6" md="3">
                <v-skeleton-loader type="article" class="rounded-xl" />
            </v-col>
        </v-row>
        <v-row v-else-if="dashboard">
            <v-col cols="6" md="3">
                <AppStatCard label="Enrollments" :value="dashboard.enrollments" icon="mdi-account-school" class="h-100" />
            </v-col>
            <v-col cols="6" md="3">
                <AppStatCard label="Completions" :value="dashboard.completions" icon="mdi-check-decagram" color="success" class="h-100" />
            </v-col>
            <v-col cols="6" md="3">
                <AppStatCard label="Completion rate" :value="`${dashboard.completion_rate}%`" icon="mdi-chart-arc" color="secondary" class="h-100" />
            </v-col>
            <v-col cols="6" md="3">
                <AppStatCard label="Active (30d)" :value="dashboard.active_learners" icon="mdi-account-clock" color="accent" class="h-100" />
            </v-col>
        </v-row>

        <v-row>
            <!-- ============ Main column ============ -->
            <v-col cols="12" md="8" class="d-flex flex-column ga-6">
                <!-- Course performance -->
                <v-card class="pa-5">
                    <div class="d-flex align-center mb-3">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Course performance</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/analytics" append-icon="mdi-chevron-right">Analytics</v-btn>
                    </div>

                    <div v-if="loadingCourses"><v-skeleton-loader type="list-item-two-line@3" /></div>
                    <template v-else-if="topCourses.length">
                        <div v-for="c in topCourses" :key="c.id ?? c.title ?? ''" class="mb-4">
                            <div class="d-flex align-center justify-space-between mb-1 ga-3">
                                <span class="text-body-2 font-weight-medium text-truncate">{{ c.title ?? 'Untitled' }}</span>
                                <span class="text-caption text-medium-emphasis text-no-wrap">
                                    {{ c.enrollments }} enrolled · {{ c.completions }} done
                                </span>
                            </div>
                            <div class="d-flex align-center ga-2">
                                <v-progress-linear
                                    :model-value="c.completion_rate"
                                    color="primary"
                                    height="6"
                                    rounded
                                    class="flex-grow-1"
                                />
                                <span class="text-caption font-weight-bold text-no-wrap" style="width: 46px; text-align: right">
                                    {{ c.completion_rate }}%
                                </span>
                            </div>
                        </div>
                    </template>
                    <AppEmptyState
                        v-else
                        icon="mdi-book-outline"
                        title="No courses yet"
                        description="Create your first course to start seeing performance here."
                    >
                        <template #action>
                            <v-btn color="primary" to="/courses/create" prepend-icon="mdi-plus">New course</v-btn>
                        </template>
                    </AppEmptyState>
                </v-card>

                <!-- Recent orders -->
                <v-card v-if="recentOrders.length" class="pa-5">
                    <div class="d-flex align-center mb-3">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Recent orders</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/revenue" append-icon="mdi-chevron-right">Revenue</v-btn>
                    </div>
                    <v-list lines="two" class="py-0">
                        <v-list-item v-for="o in recentOrders" :key="o.id" :title="o.description" class="px-0">
                            <template #subtitle>{{ o.buyer.name }} · {{ fmtDate(o.created_at) }}</template>
                            <template #append>
                                <div class="d-flex align-center ga-3">
                                    <span class="text-body-2 font-weight-bold">{{ formatMoney(o.amount, o.currency) }}</span>
                                    <OrderStatusChip :status="o.status" />
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <!-- ============ Side column ============ -->
            <v-col cols="12" md="4" class="d-flex flex-column ga-6">
                <!-- Quick actions -->
                <v-card v-if="quickActions.length" class="pa-5">
                    <h2 class="text-subtitle-1 font-weight-bold mb-3">Quick actions</h2>
                    <div class="d-flex flex-column ga-2">
                        <v-btn
                            v-for="a in quickActions"
                            :key="a.to"
                            :to="a.to"
                            :prepend-icon="a.icon"
                            variant="tonal"
                            color="primary"
                            class="justify-start"
                            block
                        >
                            {{ a.title }}
                        </v-btn>
                    </div>
                </v-card>

                <!-- Revenue snapshot -->
                <v-card class="pa-5">
                    <div class="d-flex align-center mb-3">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Revenue</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/revenue" append-icon="mdi-chevron-right">Details</v-btn>
                    </div>
                    <template v-if="revenue && revenue.by_currency.length">
                        <div v-for="row in revenue.by_currency" :key="row.currency" class="mb-3">
                            <div class="d-flex align-center justify-space-between">
                                <span class="text-caption text-medium-emphasis">{{ row.currency }} payout</span>
                                <span class="text-body-1 font-weight-bold text-success">{{ formatMoney(row.net_payout, row.currency) }}</span>
                            </div>
                            <div class="d-flex align-center justify-space-between">
                                <span class="text-caption text-medium-emphasis">Gross</span>
                                <span class="text-caption">{{ formatMoney(row.gross, row.currency) }}</span>
                            </div>
                        </div>
                        <v-divider class="my-2" />
                        <div class="d-flex align-center justify-space-between">
                            <span class="text-caption text-medium-emphasis">Paid orders</span>
                            <span class="text-body-2 font-weight-bold">{{ revenue.paid_orders }}</span>
                        </div>
                    </template>
                    <p v-else class="text-body-2 text-medium-emphasis mb-0">
                        No paid orders yet — paid course sales will show up here.
                    </p>
                </v-card>

                <!-- Recent members -->
                <v-card class="pa-2">
                    <div class="d-flex align-center px-3 pt-2 mb-1">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Recent members</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/people" append-icon="mdi-chevron-right">All</v-btn>
                    </div>
                    <div v-if="loadingMembers" class="pa-2"><v-skeleton-loader type="list-item-avatar@3" /></div>
                    <v-list v-else-if="recentMembers.length" density="compact">
                        <v-list-item v-for="m in recentMembers" :key="m.id" :title="m.user.name" rounded="lg">
                            <template #prepend>
                                <v-avatar color="primary" variant="tonal" size="34">
                                    <span class="text-caption font-weight-bold">{{ initials(m.user.name) }}</span>
                                </v-avatar>
                            </template>
                            <template #subtitle>
                                <span class="text-capitalize">{{ roleLabel(m.roles) }}</span>
                            </template>
                        </v-list-item>
                    </v-list>
                    <p v-else class="text-body-2 text-medium-emphasis pa-3 mb-0">No members yet.</p>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
