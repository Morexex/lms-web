<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()

const { data: members, isLoading: loadingMembers } = useMembers()
const { data: invitations } = useInvitations()
const invite = useInviteMember()
const revoke = useRevokeInvitation()
const { message, handle, reset } = useApiErrors()

const email = ref('')
const role = ref('student')
const roles = ['institution_admin', 'tutor', 'mentor', 'student']

async function sendInvite(): Promise<void> {
    reset()
    try {
        await invite.mutateAsync({ email: email.value, role: role.value })
        email.value = ''
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div class="d-flex flex-column ga-6">
        <h1 class="text-h4 font-weight-bold">People</h1>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select or create an institution to manage its people.
        </v-alert>

        <template v-else>
            <v-card v-if="can('members.invite')" class="pa-6">
                <h2 class="text-h6 font-weight-bold mb-4">Invite someone</h2>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
                <div class="d-flex flex-wrap ga-3 align-start">
                    <v-text-field v-model="email" label="Email" type="email" hide-details style="min-width: 240px" />
                    <v-select v-model="role" :items="roles" label="Role" hide-details style="max-width: 200px" />
                    <v-btn color="primary" size="large" :loading="invite.isPending.value" @click="sendInvite">Invite</v-btn>
                </div>
            </v-card>

            <v-card v-if="can('members.invite') && invitations?.length" class="pa-6">
                <h2 class="text-h6 font-weight-bold mb-4">Pending invitations</h2>
                <v-list>
                    <v-list-item v-for="inv in invitations" :key="inv.id" :title="inv.email" :subtitle="inv.role">
                        <template #append>
                            <v-btn variant="text" color="error" size="small" @click="revoke.mutate(inv.id)">Revoke</v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>

            <v-card class="pa-6">
                <h2 class="text-h6 font-weight-bold mb-4">Members</h2>
                <v-progress-linear v-if="loadingMembers" indeterminate color="primary" />
                <v-list v-else>
                    <v-list-item
                        v-for="m in members"
                        :key="m.id"
                        :title="m.user.name"
                        :subtitle="m.user.email"
                        prepend-icon="mdi-account-circle"
                    />
                </v-list>
            </v-card>
        </template>
    </div>
</template>
