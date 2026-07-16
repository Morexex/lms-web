<script setup lang="ts">
// Public landing page — self-contained layout (own bar + footer).
definePageMeta({ layout: false })

useSeoMeta({
    title: 'LUMEN — Learn. Grow. Connect.',
    description:
        'One learning ecosystem for courses, verifiable certificates, mentorship, community, and career growth — built for institutions and learners.',
})

const { isDark, toggle } = useAppTheme()

// Real product in the shop window — published courses across institutions.
const { data: shop } = usePublicCourses()
const activeCategory = ref('All')
const categories = computed(() => {
    const names = new Set((shop.value?.courses ?? []).map((c) => c.category).filter((c): c is string => Boolean(c)))
    return ['All', ...names]
})
const shownCourses = computed(() =>
    (shop.value?.courses ?? [])
        .filter((c) => activeCategory.value === 'All' || c.category === activeCategory.value)
        .slice(0, 8),
)

const gradients = [
    'linear-gradient(120deg, #0F766E, #134E4A)',
    'linear-gradient(120deg, #1D4ED8, #1E3A8A)',
    'linear-gradient(120deg, #0F766E, #1D4ED8)',
    'linear-gradient(120deg, #B45309, #92400E)',
]
function coverGradient(title: string): string {
    return gradients[title.length % gradients.length]!
}

function coursePrice(c: { is_free: boolean; price_amount: number | null; price_currency: string | null }): string {
    if (c.is_free || c.price_amount === null || !c.price_currency) return 'Free'
    return formatMoney(c.price_amount, c.price_currency)
}

const trust = ['Verifiable certificates', 'M-Pesa, Stripe & Paystack', 'Mentors included'] as const

const features = [
    {
        icon: 'mdi-book-open-page-variant',
        color: 'primary',
        title: 'Courses that flow',
        text: 'Video lessons, readings, and resources in a distraction-free player that remembers where you stopped.',
    },
    {
        icon: 'mdi-certificate',
        color: 'accent',
        title: 'Certificates that count',
        text: 'Finish a course and receive a certificate any employer can verify online in seconds.',
    },
    {
        icon: 'mdi-account-tie',
        color: 'secondary',
        title: 'Mentors on your side',
        text: 'Book sessions with experienced professionals across every institution on the platform.',
    },
    {
        icon: 'mdi-forum',
        color: 'primary',
        title: 'Learn together',
        text: 'Course discussions, reactions, and live sessions keep you connected, not alone.',
    },
    {
        icon: 'mdi-medal',
        color: 'accent',
        title: 'Progress you can feel',
        text: 'Points, badges, and streaks turn showing up every day into a habit.',
    },
    {
        icon: 'mdi-account-group',
        color: 'secondary',
        title: 'A network that lasts',
        text: 'Build a professional profile, earn endorsements, and stay connected after graduation.',
    },
] as const

const steps = [
    { n: 1, title: 'Join your institution', text: 'Accept an invitation or sign up and pick your academy.' },
    { n: 2, title: 'Learn at your pace', text: 'Courses, quizzes, assignments, and live sessions — on any device.' },
    { n: 3, title: 'Get certified & grow', text: 'Earn verifiable certificates, meet mentors, and grow your network.' },
] as const

const forInstitutions = [
    { icon: 'mdi-domain', text: 'Your own branded academy with full control of courses, people, and pricing' },
    { icon: 'mdi-cash-multiple', text: 'Get paid in your market — M-Pesa, Stripe & Paystack, multi-currency' },
    { icon: 'mdi-chart-box', text: 'Analytics on enrolment, completion, revenue, and drop-off' },
    { icon: 'mdi-web', text: 'A public website with pages and a blog — no deploy required' },
] as const
</script>

<template>
    <v-app>
        <v-app-bar flat color="surface" border="b">
            <v-container class="d-flex align-center py-0">
                <span class="font-heading text-h6 font-weight-bold text-primary">LUMEN</span>
                <v-spacer />
                <v-btn
                    :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                    variant="text"
                    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                    @click="toggle"
                />
                <v-btn to="/auth/login" variant="text" class="mr-1">Sign in</v-btn>
                <v-btn to="/auth/register" color="primary" variant="flat">Get started</v-btn>
            </v-container>
        </v-app-bar>

        <v-main class="bg-background">
            <!-- ============ Hero ============ -->
            <section
                class="position-relative"
                style="background: radial-gradient(1100px 500px at 70% -10%, rgba(15, 118, 110, 0.14), transparent 70%)"
            >
                <v-container class="py-16">
                    <v-row align="center">
                        <v-col cols="12" md="6">
                            <p class="text-overline text-primary font-weight-bold mb-2">ONE LEARNING ECOSYSTEM</p>
                            <h1 class="font-heading text-h3 text-md-h2 font-weight-bold mb-4" style="line-height: 1.1">
                                Learn. Grow.<br>Connect.
                            </h1>
                            <p class="text-h6 font-weight-regular text-medium-emphasis mb-6" style="max-width: 34rem">
                                Courses, verifiable certificates, mentors, and a professional network —
                                everything a learner needs, in one calm place.
                            </p>
                            <div class="d-flex flex-wrap ga-3 mb-6">
                                <v-btn to="/auth/register" color="primary" size="large" append-icon="mdi-arrow-right">
                                    Start learning free
                                </v-btn>
                                <v-btn to="/auth/login" variant="outlined" color="primary" size="large">
                                    I have an account
                                </v-btn>
                            </div>
                            <div class="d-flex flex-wrap ga-4">
                                <span v-for="item in trust" :key="item" class="d-flex align-center ga-1 text-body-2 text-medium-emphasis">
                                    <v-icon icon="mdi-check-circle" color="success" size="18" /> {{ item }}
                                </span>
                            </div>
                        </v-col>

                        <!-- Illustration built from the product's own primitives -->
                        <v-col cols="12" md="6" class="d-none d-md-block">
                            <div class="position-relative" style="height: 360px">
                                <v-card class="pa-5 position-absolute" style="top: 8%; left: 6%; width: 300px">
                                    <p class="text-caption text-medium-emphasis mb-1">CONTINUE LEARNING</p>
                                    <p class="text-body-1 font-weight-bold mb-3">Data Analytics Fundamentals</p>
                                    <v-progress-linear model-value="72" color="primary" height="8" rounded class="mb-1" />
                                    <span class="text-caption text-medium-emphasis">72% complete</span>
                                </v-card>
                                <v-card class="pa-4 position-absolute" style="top: 48%; left: 32%; width: 280px">
                                    <div class="d-flex align-center ga-3">
                                        <v-avatar color="accent" variant="tonal"><v-icon icon="mdi-certificate" /></v-avatar>
                                        <div>
                                            <p class="text-body-2 font-weight-bold mb-0">Certificate earned</p>
                                            <span class="text-caption text-medium-emphasis">Verified · LUM-8F2K</span>
                                        </div>
                                    </div>
                                </v-card>
                                <v-card class="pa-4 position-absolute" style="top: 74%; left: 10%; width: 240px">
                                    <div class="d-flex align-center ga-3">
                                        <v-avatar color="error" variant="tonal"><v-icon icon="mdi-fire" /></v-avatar>
                                        <div>
                                            <p class="text-body-2 font-weight-bold mb-0">12-day streak</p>
                                            <span class="text-caption text-medium-emphasis">Keep it alive!</span>
                                        </div>
                                    </div>
                                </v-card>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- ============ Live stats band ============ -->
            <section v-if="shop && shop.stats.courses > 0" class="py-8" style="background: rgba(15, 118, 110, 0.05)">
                <v-container>
                    <v-row class="text-center">
                        <v-col cols="4">
                            <div class="font-heading text-h4 font-weight-bold text-primary">{{ shop.stats.courses }}</div>
                            <div class="text-body-2 text-medium-emphasis">published course{{ shop.stats.courses === 1 ? '' : 's' }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="font-heading text-h4 font-weight-bold text-primary">{{ shop.stats.institutions }}</div>
                            <div class="text-body-2 text-medium-emphasis">institution{{ shop.stats.institutions === 1 ? '' : 's' }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="font-heading text-h4 font-weight-bold text-primary">{{ shop.stats.learners }}</div>
                            <div class="text-body-2 text-medium-emphasis">learner{{ shop.stats.learners === 1 ? '' : 's' }}</div>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- ============ Course showcase (real product) ============ -->
            <section v-if="shownCourses.length" class="py-14">
                <v-container>
                    <div class="d-flex align-center flex-wrap ga-3 mb-2">
                        <div>
                            <h2 class="font-heading text-h4 font-weight-bold mb-1">Explore real courses</h2>
                            <p class="text-body-1 text-medium-emphasis mb-0">Live right now, from institutions on LUMEN.</p>
                        </div>
                        <v-spacer />
                        <v-btn to="/auth/register" variant="text" color="primary" append-icon="mdi-arrow-right">
                            Join to enroll
                        </v-btn>
                    </div>

                    <!-- Category pills -->
                    <div class="d-flex flex-wrap ga-2 my-5">
                        <v-chip
                            v-for="cat in categories"
                            :key="cat"
                            :color="activeCategory === cat ? 'primary' : undefined"
                            :variant="activeCategory === cat ? 'flat' : 'tonal'"
                            class="font-weight-medium"
                            @click="activeCategory = cat"
                        >
                            {{ cat }}
                        </v-chip>
                    </div>

                    <v-row>
                        <v-col v-for="c in shownCourses" :key="c.title" cols="12" sm="6" md="3">
                            <v-card to="/auth/register" class="h-100 d-flex flex-column">
                                <div class="position-relative">
                                    <div
                                        class="d-flex align-center justify-center"
                                        :style="{ height: '110px', background: coverGradient(c.title) }"
                                    >
                                        <v-icon icon="mdi-book-open-page-variant" color="rgba(255,255,255,.85)" size="36" />
                                    </div>
                                    <v-chip
                                        size="x-small"
                                        variant="flat"
                                        color="surface"
                                        class="position-absolute font-weight-medium text-capitalize"
                                        style="top: 8px; left: 8px"
                                    >
                                        {{ c.level }}
                                    </v-chip>
                                </div>
                                <v-card-item class="pb-0">
                                    <div class="text-caption text-primary font-weight-medium">{{ c.institution }}</div>
                                    <v-card-title class="text-body-2 font-weight-bold px-0" style="white-space: normal; line-height: 1.35">
                                        {{ c.title }}
                                    </v-card-title>
                                </v-card-item>
                                <v-card-text class="text-caption text-medium-emphasis flex-grow-1 pt-1 pb-2">
                                    {{ c.summary }}
                                </v-card-text>
                                <v-divider />
                                <v-card-actions class="px-4 py-2" style="min-height: 0">
                                    <span class="text-body-2 font-weight-bold" :class="c.is_free ? 'text-success' : 'text-primary'">
                                        {{ coursePrice(c) }}
                                    </span>
                                    <v-spacer />
                                    <span v-if="c.category" class="text-caption text-medium-emphasis">{{ c.category }}</span>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- ============ Features ============ -->
            <section class="py-14">
                <v-container>
                    <div class="text-center mb-10">
                        <h2 class="font-heading text-h4 font-weight-bold mb-2">Everything learning needs</h2>
                        <p class="text-body-1 text-medium-emphasis">From the first lesson to the job offer.</p>
                    </div>
                    <v-row>
                        <v-col v-for="f in features" :key="f.title" cols="12" sm="6" md="4">
                            <v-card class="pa-6 h-100 hover-lift">
                                <v-avatar :color="f.color" variant="tonal" size="48" class="mb-4">
                                    <v-icon :icon="f.icon" size="26" />
                                </v-avatar>
                                <h3 class="text-h6 font-weight-bold mb-2">{{ f.title }}</h3>
                                <p class="text-body-2 text-medium-emphasis mb-0">{{ f.text }}</p>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- ============ How it works ============ -->
            <section class="py-14" style="background: rgba(15, 118, 110, 0.04)">
                <v-container>
                    <div class="text-center mb-10">
                        <h2 class="font-heading text-h4 font-weight-bold mb-2">How it works</h2>
                        <p class="text-body-1 text-medium-emphasis">Three steps, one journey.</p>
                    </div>
                    <v-row>
                        <v-col v-for="s in steps" :key="s.n" cols="12" md="4" class="text-center">
                            <v-avatar color="primary" size="44" class="mb-3">
                                <span class="text-h6 font-weight-bold">{{ s.n }}</span>
                            </v-avatar>
                            <h3 class="text-h6 font-weight-bold mb-1">{{ s.title }}</h3>
                            <p class="text-body-2 text-medium-emphasis mb-0" style="max-width: 20rem; margin-inline: auto">{{ s.text }}</p>
                        </v-col>
                    </v-row>
                </v-container>
            </section>

            <!-- ============ For institutions ============ -->
            <section class="py-14">
                <v-container>
                    <v-card
                        class="pa-8 pa-md-10 text-white"
                        style="background: linear-gradient(120deg, #0F766E 0%, #115E59 60%, #134E4A 100%)"
                    >
                        <v-row align="center">
                            <v-col cols="12" md="7">
                                <p class="text-overline mb-1" style="color: #fbbf24">FOR INSTITUTIONS</p>
                                <h2 class="font-heading text-h4 font-weight-bold mb-4">Run your academy on LUMEN</h2>
                                <div class="d-flex flex-column ga-3">
                                    <div v-for="item in forInstitutions" :key="item.icon" class="d-flex align-center ga-3">
                                        <v-icon :icon="item.icon" color="#fbbf24" />
                                        <span class="text-body-1" style="opacity: 0.92">{{ item.text }}</span>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" md="5" class="text-md-center">
                                <v-btn to="/auth/register" color="accent" size="x-large" variant="flat" class="font-weight-bold">
                                    Create your academy
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-container>
            </section>

            <!-- ============ Closing CTA ============ -->
            <section class="py-14 text-center">
                <v-container style="max-width: 640px">
                    <h2 class="font-heading text-h4 font-weight-bold mb-3">Start your streak today</h2>
                    <p class="text-body-1 text-medium-emphasis mb-6">
                        Join learners building skills, earning certificates, and growing their careers on LUMEN.
                    </p>
                    <v-btn to="/auth/register" color="primary" size="x-large" append-icon="mdi-arrow-right">
                        Get started — it's free
                    </v-btn>
                </v-container>
            </section>

            <!-- ============ Footer ============ -->
            <v-divider />
            <footer class="py-8">
                <v-container class="d-flex flex-wrap align-center ga-4">
                    <div>
                        <span class="font-heading text-h6 font-weight-bold text-primary">LUMEN</span>
                        <p class="text-caption text-medium-emphasis mb-0">Learn. Grow. Connect.</p>
                    </div>
                    <v-spacer />
                    <div class="d-flex ga-1">
                        <v-btn to="/auth/login" variant="text" size="small">Sign in</v-btn>
                        <v-btn to="/auth/register" variant="text" size="small">Create account</v-btn>
                    </div>
                </v-container>
            </footer>
        </v-main>
    </v-app>
</template>
