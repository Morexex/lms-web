<script setup lang="ts">
import { useDisplay } from 'vuetify'

const auth = useAuthStore()
const { isDark, toggle } = useAppTheme()
const { isAuthenticated } = storeToRefs(auth)
const { primary } = useAppNav()
const { mdAndUp } = useDisplay()

const drawer = ref(false)
</script>

<template>
    <v-app>
        <v-app-bar flat color="surface" border="b">
            <v-container class="d-flex align-center py-0">
                <ClientOnly>
                    <v-app-bar-nav-icon
                        v-if="isAuthenticated && !mdAndUp"
                        aria-label="Open navigation"
                        @click="drawer = !drawer"
                    />
                </ClientOnly>

                <NuxtLink to="/dashboard" class="text-decoration-none mr-6">
                    <span class="font-heading text-h6 font-weight-bold text-primary">LUMEN</span>
                </NuxtLink>

                <!-- Primary nav (desktop) -->
                <ClientOnly>
                    <nav v-if="isAuthenticated && mdAndUp" class="d-flex ga-1" aria-label="Primary">
                        <v-btn
                            v-for="item in primary"
                            :key="item.to"
                            :to="item.to"
                            variant="text"
                            size="small"
                            class="text-body-2 font-weight-medium"
                            height="38"
                        >
                            {{ item.title }}
                        </v-btn>
                    </nav>
                </ClientOnly>

                <v-spacer />

                <ClientOnly>
                    <InstitutionSwitcher v-if="isAuthenticated && mdAndUp" class="mr-2" />
                </ClientOnly>
                <v-btn
                    :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                    variant="text"
                    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
                    @click="toggle"
                />
                <ClientOnly>
                    <NotificationBell v-if="isAuthenticated" class="mr-1" />
                </ClientOnly>
                <ClientOnly>
                    <AppUserMenu v-if="isAuthenticated" />
                </ClientOnly>
            </v-container>
        </v-app-bar>

        <ClientOnly>
            <AppNavDrawer v-if="isAuthenticated" v-model="drawer" />
        </ClientOnly>

        <ClientOnly>
            <ImpersonationBanner />
        </ClientOnly>

        <v-main class="bg-background">
            <v-container class="py-10">
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>
