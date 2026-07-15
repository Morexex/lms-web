<script setup lang="ts">
const institution = useInstitutionStore()
const { data: sessions, isLoading } = useUpcomingSessions()
const join = useJoinSession()
const { message, handle, reset } = useApiErrors()

function fmt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

async function doJoin(id: string): Promise<void> {
    reset()
    try {
        const { join_url } = await join.mutateAsync(id)
        window.open(join_url, '_blank', 'noopener')
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-card v-if="institution.activeSlug && (isLoading || sessions?.length)" class="pa-6">
        <h2 class="text-subtitle-1 font-weight-bold mb-3">
            <v-icon icon="mdi-video" size="small" class="mr-1" /> Upcoming live sessions
        </h2>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />
        <v-list v-else>
            <v-list-item
                v-for="s in sessions"
                :key="s.id"
                :title="s.title"
                :subtitle="`${s.course?.title} · ${fmt(s.starts_at)}`"
            >
                <template #prepend>
                    <LiveProviderBadge :provider="s.provider" class="mr-2" />
                </template>
                <template #append>
                    <v-btn
                        size="small"
                        color="primary"
                        variant="tonal"
                        prepend-icon="mdi-video"
                        :loading="join.isPending.value"
                        @click="doJoin(s.id)"
                    >
                        Join
                    </v-btn>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>
