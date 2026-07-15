<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: profile, isLoading } = useMyNetworkProfile()
const actions = useNetworkProfileActions()
const { message, handle, reset } = useApiErrors()

const form = reactive({ headline: '', bio: '', is_public: true })
watch(profile, (p) => {
    if (p) Object.assign(form, { headline: p.headline, bio: p.bio ?? '', is_public: p.is_public })
}, { immediate: true })

const saved = ref(false)
const newSkill = ref('')

async function save(): Promise<void> {
    if (!form.headline.trim()) return
    reset()
    saved.value = false
    try {
        await actions.upsert.mutateAsync({ ...form })
        saved.value = true
    } catch (error) {
        handle(error)
    }
}

async function addSkill(): Promise<void> {
    if (!newSkill.value.trim()) return
    reset()
    try {
        await actions.addSkill.mutateAsync(newSkill.value)
        newSkill.value = ''
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="My professional profile" subtitle="Visible across LUMEN">
            <template #actions>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-account-network" to="/network">Network</v-btn>
            </template>
        </AppPageHeader>

        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-card class="pa-4 mb-6">
            <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-3">Profile saved.</v-alert>
            <v-text-field v-model="form.headline" label="Headline" placeholder="e.g. Full-stack developer" density="compact" class="mb-2" hide-details />
            <v-textarea v-model="form.bio" label="Bio" rows="3" auto-grow density="compact" class="mb-2" hide-details />
            <div class="d-flex align-center ga-4">
                <v-switch v-model="form.is_public" color="primary" label="Public profile" density="compact" hide-details />
                <v-spacer />
                <v-btn color="primary" :loading="actions.upsert.isPending.value" @click="save">Save</v-btn>
            </div>
        </v-card>

        <template v-if="profile">
            <div class="text-subtitle-2 font-weight-bold mb-2">Skills</div>
            <v-card class="pa-4">
                <div class="d-flex flex-wrap ga-2 mb-3">
                    <SkillChip
                        v-for="s in profile.skills"
                        :key="s.id"
                        :skill="s"
                        removable
                        @remove="actions.removeSkill.mutate(s.id)"
                    />
                    <span v-if="!profile.skills.length" class="text-body-2 text-medium-emphasis">No skills yet.</span>
                </div>
                <div class="d-flex ga-2">
                    <v-text-field v-model="newSkill" label="Add a skill" density="compact" hide-details @keyup.enter="addSkill" />
                    <v-btn color="primary" variant="tonal" :loading="actions.addSkill.isPending.value" @click="addSkill">Add</v-btn>
                </div>
            </v-card>
        </template>
    </div>
</template>
