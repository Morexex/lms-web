<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const auth = useAuthStore()
const { data: profile, isLoading, isError } = useUserProfile(id)
const { data: connections } = useConnections()
const connActions = useConnectionActions()
const endorse = useEndorse()
const { message, handle, reset } = useApiErrors()

const isSelf = computed(() => auth.user?.id === id)
const isConnected = computed(() => (connections.value ?? []).some((c) => c.user.id === id))

async function doConnect(): Promise<void> {
    reset()
    try {
        await connActions.connect.mutateAsync(id)
    } catch (error) {
        handle(error)
    }
}

function fmt(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}
</script>

<template>
    <div style="max-width: 720px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/network" class="mb-2">Network</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <v-alert v-if="isError" type="warning" variant="tonal" class="mb-4">
            This profile isn't available — it may be private.
        </v-alert>
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <template v-if="profile">
            <div class="d-flex align-center mb-4">
                <v-avatar size="64" color="primary" variant="tonal" class="mr-3">
                    <span class="text-h5">{{ profile.user.name.charAt(0) }}</span>
                </v-avatar>
                <div class="flex-grow-1">
                    <h1 class="text-h5 font-weight-bold">{{ profile.user.name }}</h1>
                    <div class="text-body-2 text-medium-emphasis">{{ profile.headline }}</div>
                </div>
                <v-btn v-if="isSelf" variant="tonal" color="primary" to="/network/profile">Edit</v-btn>
                <v-chip v-else-if="isConnected" color="success" variant="tonal" prepend-icon="mdi-check">Connected</v-chip>
                <v-btn v-else color="primary" prepend-icon="mdi-account-plus" :loading="connActions.connect.isPending.value" @click="doConnect">Connect</v-btn>
            </div>

            <p v-if="profile.bio" class="text-body-1 mb-4" style="white-space: pre-wrap">{{ profile.bio }}</p>

            <div v-if="profile.skills.length" class="mb-4">
                <div class="text-subtitle-2 font-weight-bold mb-2">Skills</div>
                <div class="d-flex flex-wrap ga-2">
                    <SkillChip
                        v-for="s in profile.skills"
                        :key="s.id"
                        :skill="s"
                        :can-endorse="isConnected && !isSelf"
                        @endorse="endorse.mutate(s)"
                    />
                </div>
                <p v-if="isConnected && !isSelf" class="text-caption text-medium-emphasis mt-1">Tap a skill to endorse it.</p>
            </div>

            <div v-if="profile.certificates.length">
                <div class="text-subtitle-2 font-weight-bold mb-2">Certificates</div>
                <v-card variant="outlined">
                    <v-list>
                        <v-list-item v-for="c in profile.certificates" :key="c.code" :title="c.course_title">
                            <template #prepend><v-icon icon="mdi-certificate" color="accent" /></template>
                            <v-list-item-subtitle>{{ c.institution_name }} · {{ fmt(c.issued_at) }}</v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
        </template>
    </div>
</template>
