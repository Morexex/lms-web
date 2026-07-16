<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()

const { data: members, isLoading: loadingMembers } = useMembers()
const { data: invitations } = useInvitations()
const invite = useInviteMember()
const revoke = useRevokeInvitation()
const changeRole = useChangeMemberRole()
const suspendMember = useSuspendMember()
const reactivateMember = useReactivateMember()
const removeMember = useRemoveMember()
const { message, handle, reset } = useApiErrors()

const email = ref('')
const role = ref('student')
const roles = [
    { title: 'Student', value: 'student' },
    { title: 'Tutor', value: 'tutor' },
    { title: 'Mentor', value: 'mentor' },
    { title: 'Admin', value: 'institution_admin' },
]

function initials(name: string): string {
    return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

async function setRole(id: string, newRole: string): Promise<void> {
    reset()
    try {
        await changeRole.mutateAsync({ id, role: newRole })
    } catch (error) {
        handle(error)
    }
}

async function act(fn: () => Promise<unknown>): Promise<void> {
    reset()
    try {
        await fn()
    } catch (error) {
        handle(error)
    }
}

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
    <div class="d-flex flex-column ga-6" style="max-width: 900px">
        <AppPageHeader title="People" subtitle="Invite, manage, and support your members" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select or create an institution to manage its people.
        </v-alert>

        <template v-else>
            <v-alert v-if="message" type="error" variant="tonal" density="compact">{{ message }}</v-alert>

            <!-- Invite -->
            <v-card v-if="can('members.invite')" class="pa-6">
                <h2 class="text-subtitle-1 font-weight-bold mb-1">
                    <v-icon icon="mdi-email-plus-outline" size="small" class="mr-1" /> Invite someone
                </h2>
                <p class="text-caption text-medium-emphasis mb-4">They'll receive an email with a link to join.</p>
                <div class="d-flex flex-wrap ga-3 align-start">
                    <v-text-field
                        v-model="email"
                        label="Email"
                        type="email"
                        placeholder="name@example.com"
                        hide-details
                        style="min-width: 240px; max-width: 340px"
                    />
                    <v-select v-model="role" :items="roles" label="Role" hide-details style="max-width: 180px" />
                    <v-btn color="primary" size="large" :loading="invite.isPending.value" @click="sendInvite">Invite</v-btn>
                </div>
            </v-card>

            <!-- Pending invitations -->
            <v-card v-if="can('members.invite') && invitations?.length" class="pa-2">
                <v-list-subheader class="font-weight-bold">
                    PENDING INVITATIONS ({{ invitations.length }})
                </v-list-subheader>
                <v-list density="compact">
                    <v-list-item v-for="inv in invitations" :key="inv.id" :title="inv.email" rounded="lg">
                        <template #prepend>
                            <v-avatar color="accent" variant="tonal" size="34">
                                <v-icon icon="mdi-email-fast-outline" size="18" />
                            </v-avatar>
                        </template>
                        <template #subtitle>
                            <span class="text-capitalize">{{ inv.role.replace('_', ' ') }}</span>
                        </template>
                        <template #append>
                            <v-btn variant="text" color="error" size="small" @click="revoke.mutate(inv.id)">Revoke</v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>

            <!-- Members -->
            <v-card class="pa-2">
                <v-list-subheader class="font-weight-bold">
                    MEMBERS {{ members ? `(${members.length})` : '' }}
                </v-list-subheader>

                <div v-if="loadingMembers" class="pa-2">
                    <v-skeleton-loader type="list-item-avatar-two-line@4" />
                </div>

                <v-list v-else lines="two">
                    <v-list-item v-for="m in members" :key="m.id" :title="m.user.name" :subtitle="m.user.email" rounded="lg">
                        <template #prepend>
                            <v-avatar color="primary" variant="tonal" size="38">
                                <span class="text-caption font-weight-bold">{{ initials(m.user.name) }}</span>
                            </v-avatar>
                        </template>
                        <template #append>
                            <div class="d-flex align-center ga-2 flex-wrap justify-end">
                                <v-chip v-if="m.status === 'suspended'" color="error" size="x-small" variant="tonal">
                                    suspended
                                </v-chip>
                                <v-btn
                                    icon="mdi-message-text-outline"
                                    size="small"
                                    variant="text"
                                    color="primary"
                                    title="Message"
                                    aria-label="Message member"
                                    :to="`/messages?to=${m.user.id}`"
                                />
                                <template v-if="can('members.manage')">
                                    <v-select
                                        :model-value="m.roles[0] ?? 'student'"
                                        :items="roles"
                                        density="compact"
                                        hide-details
                                        style="min-width: 150px; max-width: 160px"
                                        @update:model-value="(r) => setRole(m.id, r)"
                                    />
                                    <v-btn
                                        v-if="m.status !== 'suspended'"
                                        icon="mdi-pause"
                                        size="small"
                                        variant="text"
                                        color="warning"
                                        title="Suspend"
                                        aria-label="Suspend member"
                                        @click="act(() => suspendMember.mutateAsync(m.id))"
                                    />
                                    <v-btn
                                        v-else
                                        icon="mdi-play"
                                        size="small"
                                        variant="text"
                                        color="success"
                                        title="Reactivate"
                                        aria-label="Reactivate member"
                                        @click="act(() => reactivateMember.mutateAsync(m.id))"
                                    />
                                    <v-btn
                                        icon="mdi-delete-outline"
                                        size="small"
                                        variant="text"
                                        color="error"
                                        title="Remove"
                                        aria-label="Remove member"
                                        @click="act(() => removeMember.mutateAsync(m.id))"
                                    />
                                </template>
                            </div>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </template>
    </div>
</template>

<style scoped>
/* On phones the role select + actions drop below the identity instead of
   squeezing beside it. */
@media (max-width: 700px) {
    :deep(.v-list-item) {
        flex-wrap: wrap;
    }
    :deep(.v-list-item__append) {
        width: 100%;
        justify-content: flex-end;
        padding-top: 8px;
    }
}
</style>
