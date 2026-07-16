<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const search = ref('')
const { data: users, isLoading } = usePlatformUsers(search)
const suspend = useSuspendUser()
const reactivate = useReactivateUser()
const impersonate = useImpersonateUser()

async function startImpersonation(id: string): Promise<void> {
    const payload = await impersonate.mutateAsync(id)
    await auth.beginImpersonation(payload.access_token, payload.impersonator)
    await navigateTo('/dashboard')
}

const statusColor = (status: string): string =>
    status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'warning'

function initials(name: string): string {
    return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
    <div style="max-width: 900px">
        <AppPageHeader title="Users" subtitle="Platform-wide user administration" />

        <v-text-field
            v-model="search"
            label="Search by name or email"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="mb-4"
            style="max-width: 420px"
        />

        <v-card v-if="isLoading" class="pa-4">
            <v-skeleton-loader type="list-item-avatar-two-line@5" />
        </v-card>

        <v-card v-else>
            <v-table hover>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Status</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td class="py-2">
                            <div class="d-flex align-center ga-3">
                                <v-avatar color="primary" variant="tonal" size="34">
                                    <span class="text-caption font-weight-bold">{{ initials(u.name) }}</span>
                                </v-avatar>
                                <div>
                                    <div class="font-weight-medium">{{ u.name }}</div>
                                    <div class="text-caption text-medium-emphasis">{{ u.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td><v-chip :color="statusColor(u.status)" size="small" variant="tonal">{{ u.status }}</v-chip></td>
                        <td class="text-right">
                            <v-btn
                                v-if="u.status !== 'suspended'"
                                size="small"
                                variant="text"
                                color="error"
                                @click="suspend.mutate(u.id)"
                            >
                                Suspend
                            </v-btn>
                            <v-btn v-else size="small" variant="text" color="success" @click="reactivate.mutate(u.id)">
                                Reactivate
                            </v-btn>
                            <v-btn
                                size="small"
                                variant="text"
                                prepend-icon="mdi-account-switch-outline"
                                @click="startImpersonation(u.id)"
                            >
                                Impersonate
                            </v-btn>
                        </td>
                    </tr>
                    <tr v-if="users && users.length === 0">
                        <td colspan="3" class="text-center text-medium-emphasis py-8">
                            <v-icon icon="mdi-account-search-outline" size="32" class="mb-2 d-block mx-auto" />
                            No users match your search.
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>
