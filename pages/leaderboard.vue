<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const institution = useInstitutionStore()
const { data: rows, isLoading } = useLeaderboard()
const { data: me } = useGamification()
const optIn = useLeaderboardOptIn()
const { message, handle, reset } = useApiErrors()

async function join(): Promise<void> {
    reset()
    try {
        await optIn.mutateAsync(true)
    } catch (error) {
        handle(error)
    }
}

function medal(rank: number): string | null {
    return ({ 1: '🥇', 2: '🥈', 3: '🥉' } as Record<number, string>)[rank] ?? null
}
</script>

<template>
    <div style="max-width: 640px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/achievements" class="mb-2">Achievements</v-btn>
        <AppPageHeader title="Leaderboard" subtitle="Top learners in your institution (opted-in only)" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to see its leaderboard.
        </v-alert>

        <template v-else>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <v-alert v-if="me && !me.leaderboard_opt_in" type="info" variant="tonal" class="mb-4">
                <div class="d-flex align-center flex-wrap ga-3">
                    <span>You're not on the leaderboard. Opt in to compete with your peers.</span>
                    <v-btn size="small" color="info" variant="flat" :loading="optIn.isPending.value" @click="join">Join</v-btn>
                </div>
            </v-alert>

            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-card v-if="rows?.length">
                <v-list>
                    <v-list-item
                        v-for="row in rows"
                        :key="row.rank"
                        :class="{ 'bg-surface-variant': row.is_me }"
                    >
                        <template #prepend>
                            <div class="text-h6 font-weight-bold mr-3" style="width: 36px; text-align: center">
                                {{ medal(row.rank) ?? row.rank }}
                            </div>
                            <v-avatar color="primary" variant="tonal" size="34">{{ (row.user.name ?? '?').charAt(0) }}</v-avatar>
                        </template>
                        <v-list-item-title class="font-weight-medium">
                            {{ row.user.name }}
                            <v-chip v-if="row.is_me" size="x-small" color="primary" variant="tonal" class="ml-1">you</v-chip>
                        </v-list-item-title>
                        <template #append>
                            <span class="font-weight-bold text-primary">{{ row.points.toLocaleString() }} pts</span>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>

            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-podium"
                title="Nobody on the board yet"
                description="Points appear here once opted-in learners start earning them."
            />
        </template>
    </div>
</template>
