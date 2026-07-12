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
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-1">Users</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">Platform-wide user administration.</p>

        <v-text-field
            v-model="search"
            label="Search by name or email"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            class="mb-4"
            style="max-width: 420px"
        />

        <v-card>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" />
            <v-table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="u in users" :key="u.id">
                        <td>{{ u.name }}</td>
                        <td>{{ u.email }}</td>
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
                            <v-btn size="small" variant="text" @click="startImpersonation(u.id)">Impersonate</v-btn>
                        </td>
                    </tr>
                    <tr v-if="users && users.length === 0">
                        <td colspan="4" class="text-center text-medium-emphasis py-6">No users found.</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>
