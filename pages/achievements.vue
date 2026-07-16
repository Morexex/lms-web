<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: me, isLoading } = useGamification()
const optIn = useLeaderboardOptIn()
const institution = useInstitutionStore()
const { message, handle, reset } = useApiErrors()

async function toggleOptIn(value: boolean | null): Promise<void> {
    reset()
    try {
        await optIn.mutateAsync(Boolean(value))
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 760px">
        <AppPageHeader title="Achievements" subtitle="Your points, streak, and badges across LUMEN">
            <template #actions>
                <v-btn v-if="institution.activeSlug" variant="tonal" color="primary" prepend-icon="mdi-podium" to="/leaderboard">
                    Leaderboard
                </v-btn>
            </template>
        </AppPageHeader>

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <template v-if="me">
            <v-row class="mb-1">
                <v-col cols="6" md="4"><AppStatCard label="Total points" :value="me.total_points" icon="mdi-star-circle" color="accent" /></v-col>
                <v-col cols="6" md="4"><AppStatCard label="Current streak" :value="`${me.streak_days} day${me.streak_days === 1 ? '' : 's'}`" icon="mdi-fire" color="error" /></v-col>
                <v-col cols="12" md="4"><AppStatCard label="Badges earned" :value="me.badges.length" icon="mdi-medal" color="secondary" /></v-col>
            </v-row>

            <div class="text-subtitle-2 font-weight-bold mb-2">Badges</div>
            <v-row v-if="me.badges.length" class="mb-2">
                <v-col v-for="b in me.badges" :key="b.badge" cols="6" sm="4">
                    <BadgeTile :badge="b" />
                </v-col>
            </v-row>
            <AppEmptyState
                v-else
                icon="mdi-medal-outline"
                title="No badges yet"
                description="Complete courses, keep a learning streak, and join discussions to earn your first badge."
            />

            <v-card class="pa-4 mt-4">
                <div class="d-flex align-center flex-wrap ga-3">
                    <div>
                        <div class="text-subtitle-2 font-weight-bold">Appear on leaderboards</div>
                        <p class="text-caption text-medium-emphasis mb-0">
                            Off by default. When enabled, your name and points appear on your institution's leaderboard.
                        </p>
                    </div>
                    <v-spacer />
                    <v-switch
                        :model-value="me.leaderboard_opt_in"
                        color="primary"
                        density="compact"
                        hide-details
                        :loading="optIn.isPending.value"
                        @update:model-value="toggleOptIn"
                    />
                </div>
            </v-card>
        </template>
    </div>
</template>
