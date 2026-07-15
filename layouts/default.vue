<script setup lang="ts">
const auth = useAuthStore()
const { isDark, toggle } = useAppTheme()
const { isAuthenticated } = storeToRefs(auth)

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
                    <v-menu v-if="isAuthenticated">
                        <template #activator="{ props }">
                            <v-btn v-bind="props" icon="mdi-account-circle" variant="text" aria-label="Account" />
                        </template>
                        <v-list>
                            <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard" />
                            <v-list-item to="/catalog" prepend-icon="mdi-book-open-variant" title="Catalog" />
                            <v-list-item to="/courses" prepend-icon="mdi-bookshelf" title="Manage courses" />
                            <v-list-item to="/people" prepend-icon="mdi-account-group" title="People" />
                            <v-list-item to="/profile" prepend-icon="mdi-account" title="Profile" />
                            <v-list-item to="/platform/users" prepend-icon="mdi-shield-account" title="Admin: Users" />
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
