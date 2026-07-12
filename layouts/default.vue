<script setup lang="ts">
const { isDark, toggle } = useAppTheme()
const { isAuthenticated } = storeToRefs(useAuthStore())
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
            </v-container>
        </v-app-bar>

        <v-main class="bg-background">
            <v-container class="py-10">
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>
