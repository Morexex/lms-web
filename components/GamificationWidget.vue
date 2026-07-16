<script setup lang="ts">
const { data: me, isLoading } = useGamification()
</script>

<template>
    <v-card v-if="isLoading || me" class="pa-5">
        <div class="d-flex align-center flex-wrap ga-6">
            <h2 class="text-subtitle-1 font-weight-bold mb-0">
                <v-icon icon="mdi-star-circle" size="small" color="accent" class="mr-1" /> Your progress
            </h2>
            <v-progress-circular v-if="isLoading" indeterminate size="18" width="2" color="primary" />
            <template v-else-if="me">
                <div class="d-flex align-center ga-1">
                    <span class="text-h6 font-weight-bold text-primary">{{ me.total_points.toLocaleString() }}</span>
                    <span class="text-caption text-medium-emphasis">points</span>
                </div>
                <div class="d-flex align-center ga-1">
                    <v-icon icon="mdi-fire" size="small" color="error" />
                    <span class="text-h6 font-weight-bold">{{ me.streak_days }}</span>
                    <span class="text-caption text-medium-emphasis">day streak</span>
                </div>
                <div class="d-flex align-center ga-1">
                    <v-icon icon="mdi-medal" size="small" color="secondary" />
                    <span class="text-h6 font-weight-bold">{{ me.badges.length }}</span>
                    <span class="text-caption text-medium-emphasis">badges</span>
                </div>
            </template>
            <v-spacer />
            <v-btn size="small" variant="tonal" color="primary" append-icon="mdi-chevron-right" to="/achievements">
                Achievements
            </v-btn>
        </div>
    </v-card>
</template>
