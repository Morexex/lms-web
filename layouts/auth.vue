<template>
    <v-app>
        <v-main class="bg-background">
            <v-row no-gutters class="fill-height" style="min-height: 100dvh">
                <!-- Brand panel (desktop) -->
                <v-col
                    cols="12"
                    md="5"
                    class="d-none d-md-flex flex-column justify-center pa-12 text-white position-relative"
                    style="background: linear-gradient(160deg, #0F766E 0%, #115E59 55%, #0F1F2E 130%)"
                >
                    <!-- soft decorative glow -->
                    <div
                        class="position-absolute"
                        style="top: -120px; right: -120px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.25), transparent 70%)"
                        aria-hidden="true"
                    />

                    <NuxtLink to="/" class="text-decoration-none">
                        <span class="font-heading text-h4 font-weight-bold text-white">LUMEN</span>
                    </NuxtLink>
                    <p class="text-h6 font-weight-regular mt-2 mb-10" style="opacity: 0.85">Learn. Grow. Connect.</p>

                    <div class="d-flex flex-column ga-6" style="max-width: 26rem">
                        <div class="d-flex align-start ga-4">
                            <v-avatar color="rgba(255,255,255,0.12)" size="42">
                                <v-icon icon="mdi-book-open-page-variant" color="#FBBF24" />
                            </v-avatar>
                            <div>
                                <p class="text-body-1 font-weight-bold mb-1">Courses that fit your life</p>
                                <p class="text-body-2 mb-0" style="opacity: 0.8">Learn at your pace and pick up exactly where you left off.</p>
                            </div>
                        </div>
                        <div class="d-flex align-start ga-4">
                            <v-avatar color="rgba(255,255,255,0.12)" size="42">
                                <v-icon icon="mdi-certificate" color="#FBBF24" />
                            </v-avatar>
                            <div>
                                <p class="text-body-1 font-weight-bold mb-1">Certificates employers trust</p>
                                <p class="text-body-2 mb-0" style="opacity: 0.8">Every certificate is verifiable online in seconds.</p>
                            </div>
                        </div>
                        <div class="d-flex align-start ga-4">
                            <v-avatar color="rgba(255,255,255,0.12)" size="42">
                                <v-icon icon="mdi-account-group" color="#FBBF24" />
                            </v-avatar>
                            <div>
                                <p class="text-body-1 font-weight-bold mb-1">Mentors & community</p>
                                <p class="text-body-2 mb-0" style="opacity: 0.8">Real people supporting your journey, from first lesson to first job.</p>
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Form panel -->
                <v-col cols="12" md="7" class="d-flex align-center justify-center pa-6 py-12">
                    <div class="w-100" style="max-width: 440px">
                        <!-- Brand header (mobile only — the panel covers desktop) -->
                        <div class="text-center mb-8 d-md-none">
                            <NuxtLink to="/" class="text-decoration-none">
                                <span class="font-heading text-h4 font-weight-bold text-primary">LUMEN</span>
                            </NuxtLink>
                            <p class="text-body-2 text-medium-emphasis mt-1">Learn. Grow. Connect.</p>
                        </div>
                        <slot />
                    </div>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>
