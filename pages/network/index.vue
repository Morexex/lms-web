<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: feed, isLoading: loadingFeed } = useFeed()
const { data: connections } = useConnections()
const { data: pending } = usePendingConnections()
const actions = useConnectionActions()

const tab = ref<'feed' | 'connections' | 'requests'>('feed')

function fmt(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="Network" subtitle="Your professional connections and their milestones">
            <template #actions>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-account-edit" to="/network/profile">My profile</v-btn>
            </template>
        </AppPageHeader>

        <v-tabs v-model="tab" color="primary" class="mb-4">
            <v-tab value="feed">Feed</v-tab>
            <v-tab value="connections">Connections</v-tab>
            <v-tab value="requests">
                Requests
                <v-badge v-if="pending?.length" :content="pending.length" color="error" inline class="ml-1" />
            </v-tab>
        </v-tabs>

        <!-- Feed -->
        <template v-if="tab === 'feed'">
            <v-progress-linear v-if="loadingFeed" indeterminate color="primary" />
            <v-card v-if="feed?.length">
                <v-list>
                    <v-list-item v-for="m in feed" :key="m.id" :to="`/network/users/${m.user.id}`">
                        <template #prepend>
                            <v-avatar color="primary" variant="tonal" size="36">{{ m.user.name.charAt(0) }}</v-avatar>
                        </template>
                        <v-list-item-title><strong>{{ m.user.name }}</strong> {{ m.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ fmt(m.occurred_at) }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card>
            <AppEmptyState
                v-else-if="!loadingFeed"
                icon="mdi-timeline-text-outline"
                title="Your feed is quiet"
                description="Connect with peers to see their milestones here."
            />
        </template>

        <!-- Connections -->
        <template v-else-if="tab === 'connections'">
            <v-card v-if="connections?.length">
                <v-list>
                    <v-list-item v-for="c in connections" :key="c.id" :title="c.user.name" :to="`/network/users/${c.user.id}`">
                        <template #prepend>
                            <v-avatar color="primary" variant="tonal" size="36">{{ c.user.name.charAt(0) }}</v-avatar>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
            <AppEmptyState v-else icon="mdi-account-group-outline" title="No connections yet" description="Find people via their profiles and connect." />
        </template>

        <!-- Requests -->
        <template v-else>
            <v-card v-if="pending?.length">
                <v-list>
                    <v-list-item v-for="p in pending" :key="p.id" :title="p.user.name">
                        <template #prepend>
                            <v-avatar color="primary" variant="tonal" size="36">{{ p.user.name.charAt(0) }}</v-avatar>
                        </template>
                        <template #append>
                            <v-btn size="small" color="primary" variant="tonal" class="mr-1" :loading="actions.accept.isPending.value" @click="actions.accept.mutate(p.id)">Accept</v-btn>
                            <v-btn size="small" variant="text" @click="actions.decline.mutate(p.id)">Decline</v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
            <AppEmptyState v-else icon="mdi-account-clock-outline" title="No pending requests" description="Connection requests will appear here." />
        </template>
    </div>
</template>
