<script setup lang="ts">
// Public landing page — self-contained layout (own bar + footer).
definePageMeta({ layout: false })

useSeoMeta({
    title: 'LUMEN — Learn. Grow. Connect.',
    description:
        'One learning ecosystem for courses, verifiable certificates, mentorship, community, and career growth — built for institutions and learners.',
})

const { isDark, toggle } = useAppTheme()

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
                            <div class="d-flex flex-wrap ga-3">
                                <v-btn to="/auth/register" color="primary" size="large" append-icon="mdi-arrow-right">
                                    Start learning free
                                </v-btn>
                                <v-btn to="/auth/login" variant="outlined" color="primary" size="large">
                                    I have an account
                                </v-btn>
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
