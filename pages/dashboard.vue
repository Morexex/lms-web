<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const institution = useInstitutionStore()

// --- Email verification (preserved behaviour) ---
const resent = ref(false)
const resending = ref(false)
async function resend(): Promise<void> {
    resending.value = true
    try {
        await auth.resendVerification()
        resent.value = true
    } finally {
        resending.value = false
    }
}

// --- Personal greeting ---
const firstName = computed(() => (auth.user?.name ?? '').split(' ')[0] || 'there')
const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
})
const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

// --- Data (all existing composables — no new endpoints) ---
const { data: enrollments, isLoading: loadingCourses } = useMyEnrollments()
const { data: game } = useGamification()
const { data: announcements, isLoading: loadingNews } = useAnnouncements()
const { data: certificates } = useMyCertificates()

/** The course to resume: in progress, furthest along first. */
const continueCourse = computed(() => {
    const active = (enrollments.value ?? []).filter((e) => !e.completed_at)
    return [...active].sort((a, b) => b.progress - a.progress)[0] ?? null
})
/** Up to three other active courses for the mini-grid. */
const otherCourses = computed(() =>
    (enrollments.value ?? [])
        .filter((e) => e.id !== continueCourse.value?.id && !e.completed_at)
        .slice(0, 3),
)
const latestNews = computed(() => (announcements.value ?? []).slice(0, 3))

function fmtDate(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''
}
</script>

<template>
    <div class="d-flex flex-column ga-6">
        <!-- Greeting -->
        <div>
            <p class="text-body-2 text-medium-emphasis mb-1">{{ today }}</p>
            <h1 class="text-h4 font-weight-bold mb-1">{{ greeting }}, {{ firstName }} 👋</h1>
            <p v-if="game && game.streak_days > 0" class="text-body-1 text-medium-emphasis mb-0">
                You're on a <strong class="text-error">{{ game.streak_days }}-day streak</strong> — keep it alive today.
            </p>
            <p v-else class="text-body-1 text-medium-emphasis mb-0">A little progress every day adds up.</p>
        </div>

        <!-- Email verification (preserved) -->
        <v-alert v-if="auth.user && !auth.isVerified && !resent" type="warning" variant="tonal">
            <div class="d-flex align-center flex-wrap ga-3">
                <span>Please verify your email to unlock everything.</span>
                <v-btn size="small" color="warning" variant="flat" :loading="resending" @click="resend">Resend email</v-btn>
            </div>
        </v-alert>
        <v-alert v-if="resent" type="success" variant="tonal">Verification email sent — check your inbox.</v-alert>

        <v-row>
            <!-- ============ Main column ============ -->
            <v-col cols="12" md="8" class="d-flex flex-column ga-6">
                <!-- Continue learning hero -->
                <v-skeleton-loader v-if="loadingCourses && institution.activeSlug" type="article" class="rounded-xl" />

                <v-card
                    v-else-if="continueCourse"
                    :to="`/learn/${continueCourse.course.id}`"
                    class="pa-6 text-white"
                    style="background: linear-gradient(120deg, #0F766E 0%, #115E59 60%, #134E4A 100%)"
                >
                    <div class="d-flex align-center ga-6 flex-wrap">
                        <v-progress-circular
                            :model-value="continueCourse.progress"
                            :size="88"
                            :width="8"
                            color="#F59E0B"
                            bg-color="rgba(255,255,255,.2)"
                        >
                            <span class="text-body-2 font-weight-bold text-white">{{ continueCourse.progress }}%</span>
                        </v-progress-circular>
                        <div class="flex-grow-1" style="min-width: 220px">
                            <p class="text-caption mb-1" style="opacity: 0.8">CONTINUE LEARNING</p>
                            <h2 class="text-h5 font-weight-bold mb-1">{{ continueCourse.course.title }}</h2>
                            <p class="text-body-2 mb-0" style="opacity: 0.85">
                                Pick up right where you left off.
                            </p>
                        </div>
                        <v-btn color="accent" variant="flat" size="large" append-icon="mdi-arrow-right" class="font-weight-bold">
                            Resume
                        </v-btn>
                    </div>
                </v-card>

                <!-- First-run / explore states -->
                <v-card v-else-if="!institution.activeSlug" class="pa-8 text-center">
                    <v-icon icon="mdi-school-outline" size="48" color="primary" class="mb-3" />
                    <h2 class="text-h6 font-weight-bold mb-1">Welcome to LUMEN</h2>
                    <p class="text-body-2 text-medium-emphasis mb-4">Select or join an institution to start learning.</p>
                </v-card>
                <v-card v-else class="pa-8 text-center">
                    <v-icon icon="mdi-compass-outline" size="48" color="primary" class="mb-3" />
                    <h2 class="text-h6 font-weight-bold mb-1">Find your next course</h2>
                    <p class="text-body-2 text-medium-emphasis mb-4">Nothing in progress — explore the catalog and start something new.</p>
                    <v-btn color="primary" to="/catalog" prepend-icon="mdi-book-open-variant">Browse catalog</v-btn>
                </v-card>

                <!-- Other active courses -->
                <div v-if="otherCourses.length">
                    <div class="d-flex align-center mb-3">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Also in progress</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/learning" append-icon="mdi-chevron-right">View all</v-btn>
                    </div>
                    <v-row dense>
                        <v-col v-for="e in otherCourses" :key="e.id" cols="12" sm="4">
                            <v-card :to="`/learn/${e.course.id}`" class="pa-4 h-100">
                                <p class="text-body-2 font-weight-bold mb-2" style="min-height: 40px">{{ e.course.title }}</p>
                                <v-progress-linear :model-value="e.progress" color="primary" height="6" rounded class="mb-1" />
                                <span class="text-caption text-medium-emphasis">{{ e.progress }}% complete</span>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <!-- Announcements -->
                <div v-if="institution.activeSlug">
                    <div class="d-flex align-center mb-3">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Latest announcements</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/announcements" append-icon="mdi-chevron-right">All</v-btn>
                    </div>
                    <v-skeleton-loader v-if="loadingNews" type="list-item-two-line@2" class="rounded-xl" />
                    <v-card v-else-if="latestNews.length">
                        <v-list lines="two">
                            <v-list-item v-for="a in latestNews" :key="a.id" :title="a.title" :subtitle="a.body">
                                <template #prepend>
                                    <v-avatar color="secondary" variant="tonal" size="36">
                                        <v-icon icon="mdi-bullhorn-outline" size="18" />
                                    </v-avatar>
                                </template>
                                <template #append>
                                    <span class="text-caption text-medium-emphasis">{{ fmtDate(a.created_at) }}</span>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <v-card v-else variant="outlined" class="pa-5 text-center">
                        <p class="text-body-2 text-medium-emphasis mb-0">No announcements yet — you're all caught up.</p>
                    </v-card>
                </div>
            </v-col>

            <!-- ============ Side column ============ -->
            <v-col cols="12" md="4" class="d-flex flex-column ga-6">
                <!-- Progress stats -->
                <v-card v-if="game" class="pa-5">
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">Your progress</h2>
                    <div class="d-flex flex-column ga-4">
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="accent" variant="tonal" size="40"><v-icon icon="mdi-star-circle" /></v-avatar>
                            <div>
                                <div class="text-h6 font-weight-bold lh-1">{{ game.total_points.toLocaleString() }}</div>
                                <span class="text-caption text-medium-emphasis">points earned</span>
                            </div>
                        </div>
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="error" variant="tonal" size="40"><v-icon icon="mdi-fire" /></v-avatar>
                            <div>
                                <div class="text-h6 font-weight-bold lh-1">{{ game.streak_days }} day{{ game.streak_days === 1 ? '' : 's' }}</div>
                                <span class="text-caption text-medium-emphasis">current streak</span>
                            </div>
                        </div>
                        <div class="d-flex align-center ga-3">
                            <v-avatar color="secondary" variant="tonal" size="40"><v-icon icon="mdi-medal" /></v-avatar>
                            <div>
                                <div class="text-h6 font-weight-bold lh-1">{{ game.badges.length }}</div>
                                <span class="text-caption text-medium-emphasis">badges</span>
                            </div>
                        </div>
                    </div>
                    <v-btn block variant="tonal" color="primary" class="mt-4" to="/achievements" append-icon="mdi-chevron-right">
                        Achievements
                    </v-btn>
                </v-card>

                <UpcomingSessions />

                <!-- Certificates -->
                <v-card class="pa-5">
                    <div class="d-flex align-center mb-2">
                        <h2 class="text-subtitle-1 font-weight-bold mb-0">Certificates</h2>
                        <v-spacer />
                        <v-btn variant="text" size="small" to="/certificates" append-icon="mdi-chevron-right">All</v-btn>
                    </div>
                    <template v-if="certificates?.length">
                        <p class="text-body-2 text-medium-emphasis mb-2">
                            You've earned <strong>{{ certificates.length }}</strong> certificate{{ certificates.length === 1 ? '' : 's' }}.
                        </p>
                        <div class="d-flex align-center ga-2">
                            <v-icon icon="mdi-certificate" color="accent" />
                            <span class="text-body-2 font-weight-medium text-truncate">{{ certificates[0]!.course_title }}</span>
                        </div>
                    </template>
                    <p v-else class="text-body-2 text-medium-emphasis mb-0">
                        Complete a course to earn your first verifiable certificate.
                    </p>
                </v-card>

                <!-- Access (preserved from the old dashboard, now compact) -->
                <v-card v-if="auth.user?.roles.length" variant="outlined" class="pa-4">
                    <p class="text-caption text-medium-emphasis mb-2">YOUR ACCESS</p>
                    <div class="d-flex flex-wrap ga-2">
                        <v-chip v-for="role in auth.user.roles" :key="role" color="primary" size="small" variant="tonal">{{ role }}</v-chip>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
