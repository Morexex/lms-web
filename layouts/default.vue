<script setup lang="ts">
const auth = useAuthStore()
const { isDark, toggle } = useAppTheme()
const { isAuthenticated, isPlatformAdmin } = storeToRefs(auth)
const { isEnabled } = useFeatures()

async function signOut(): Promise<void> {
    await auth.logout()
    await navigateTo('/auth/login')
}
</script>

<template>
    <v-app>
        <v-app-bar flat color="surface" border="b">
            <v-container class="d-flex align-center">
                <span class="font-heading text-h6 font-weight-bold text-primary">LUMEN</span>
                <v-spacer />
                <ClientOnly>
                    <InstitutionSwitcher v-if="isAuthenticated" class="mr-2" />
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
                    <v-menu v-if="isAuthenticated">
                        <template #activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-account-circle" variant="text" aria-label="Account" />
                        </template>
                        <v-list>
                            <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard" />
                            <v-list-item to="/catalog" prepend-icon="mdi-book-open-variant" title="Catalog" />
                            <v-list-item to="/learning" prepend-icon="mdi-play-circle" title="My learning" />
                            <v-list-item to="/messages" prepend-icon="mdi-message-text" title="Messages" />
                            <v-list-item v-if="isEnabled('mentorship')" to="/mentors" prepend-icon="mdi-account-tie" title="Find a mentor" />
                            <v-list-item v-if="isEnabled('mentorship')" to="/mentorship/sessions" prepend-icon="mdi-calendar-account" title="My sessions" />
                            <v-list-item to="/network" prepend-icon="mdi-account-network" title="Network" />
                            <v-list-item v-if="isEnabled('gamification')" to="/achievements" prepend-icon="mdi-medal" title="Achievements" />
                            <v-list-item to="/certificates" prepend-icon="mdi-certificate" title="Certificates" />
                            <v-list-item to="/courses" prepend-icon="mdi-bookshelf" title="Manage courses" />
                            <v-list-item to="/orders" prepend-icon="mdi-receipt-text" title="My orders" />
                            <v-list-item to="/revenue" prepend-icon="mdi-cash-multiple" title="Revenue" />
                            <v-list-item to="/analytics" prepend-icon="mdi-chart-box" title="Analytics" />
                            <v-list-item to="/manage/cms" prepend-icon="mdi-web" title="Website" />
                            <v-list-item to="/announcements" prepend-icon="mdi-bullhorn" title="Announcements" />
                            <v-list-item to="/people" prepend-icon="mdi-account-group" title="People" />
                            <v-list-item to="/profile" prepend-icon="mdi-account" title="Profile" />
                            <template v-if="isPlatformAdmin">
                                <v-divider />
                                <v-list-item to="/platform/users" prepend-icon="mdi-shield-account" title="Admin: Users" />
                                <v-list-item to="/platform/settings" prepend-icon="mdi-cog-outline" title="Admin: Platform" />
                            </template>
                            <v-divider />
                            <v-list-item prepend-icon="mdi-logout" title="Sign out" @click="signOut" />
                        </v-list>
                    </v-menu>
                </ClientOnly>
            </v-container>
        </v-app-bar>

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
