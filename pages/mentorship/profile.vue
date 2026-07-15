<script setup lang="ts">
import type { MentorService } from '~/types/mentorship'

definePageMeta({ middleware: 'auth' })

const { data: profile, isLoading } = useMyMentorProfile()
const actions = useMentorProfileActions()
const { message, handle, reset } = useApiErrors()

const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone
const timezones = ((): string[] => {
    const intl = Intl as unknown as { supportedValuesOf?: (k: string) => string[] }
    return intl.supportedValuesOf ? intl.supportedValuesOf('timeZone') : [viewerTz]
})()
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const form = reactive({ headline: '', bio: '', timezone: viewerTz, is_published: false })
watch(profile, (p) => {
    if (p) Object.assign(form, { headline: p.headline, bio: p.bio ?? '', timezone: p.timezone, is_published: p.is_published })
}, { immediate: true })

const savedProfile = ref(false)
async function saveProfile(): Promise<void> {
    reset()
    savedProfile.value = false
    try {
        await actions.upsert.mutateAsync({ ...form })
        savedProfile.value = true
    } catch (error) {
        handle(error)
    }
}

const svc = reactive({ title: '', duration_minutes: 30, is_free: true, price_amount: 1000, price_currency: 'KES' })
async function addService(): Promise<void> {
    if (!svc.title.trim()) return
    reset()
    try {
        const payload: Partial<MentorService> = { title: svc.title, duration_minutes: svc.duration_minutes, is_free: svc.is_free }
        if (!svc.is_free) {
            payload.price_amount = svc.price_amount
            payload.price_currency = svc.price_currency
        }
        await actions.createService.mutateAsync(payload)
        svc.title = ''
    } catch (error) {
        handle(error)
    }
}

const av = reactive({ day_of_week: 1, start_time: '09:00', end_time: '17:00' })
async function addAvailability(): Promise<void> {
    reset()
    try {
        await actions.addAvailability.mutateAsync({ ...av })
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="Mentor profile" subtitle="Publish yourself to the mentor marketplace" />

        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <!-- Profile -->
        <v-card class="pa-4 mb-6">
            <v-alert v-if="savedProfile" type="success" variant="tonal" density="compact" class="mb-3">Profile saved.</v-alert>
            <v-text-field v-model="form.headline" label="Headline" placeholder="e.g. Senior Product Designer" density="compact" class="mb-2" hide-details />
            <v-textarea v-model="form.bio" label="Bio" rows="3" auto-grow density="compact" class="mb-2" hide-details />
            <v-autocomplete v-model="form.timezone" :items="timezones" label="Your timezone" density="compact" class="mb-2" hide-details />
            <div class="d-flex align-center ga-4">
                <v-switch v-model="form.is_published" color="primary" label="Published" density="compact" hide-details />
                <v-spacer />
                <v-btn color="primary" :loading="actions.upsert.isPending.value" @click="saveProfile">Save profile</v-btn>
            </div>
        </v-card>

        <template v-if="profile">
            <!-- Services -->
            <div class="text-subtitle-2 font-weight-bold mb-2">Services</div>
            <v-card class="mb-3">
                <v-list v-if="profile.services?.length">
                    <v-list-item v-for="s in profile.services" :key="s.id" :title="s.title">
                        <template #subtitle>
                            {{ s.duration_minutes }} min · {{ s.is_free ? 'Free' : `${s.price_currency} ${s.price_amount}` }}
                        </template>
                        <template #append>
                            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="actions.deleteService.mutate(s.id)" />
                        </template>
                    </v-list-item>
                </v-list>
                <div class="pa-4">
                    <div class="d-flex flex-wrap ga-2 align-center">
                        <v-text-field v-model="svc.title" label="Service title" density="compact" hide-details style="min-width: 200px" />
                        <v-text-field v-model.number="svc.duration_minutes" label="Min" type="number" min="15" density="compact" hide-details style="max-width: 90px" />
                        <v-switch v-model="svc.is_free" color="primary" label="Free" density="compact" hide-details />
                        <template v-if="!svc.is_free">
                            <v-text-field v-model.number="svc.price_amount" label="Price" type="number" min="1" density="compact" hide-details style="max-width: 110px" />
                            <v-text-field v-model="svc.price_currency" label="Cur" density="compact" hide-details style="max-width: 80px" />
                        </template>
                        <v-btn color="primary" variant="tonal" :loading="actions.createService.isPending.value" @click="addService">Add</v-btn>
                    </div>
                </div>
            </v-card>

            <!-- Availability -->
            <div class="text-subtitle-2 font-weight-bold mb-2">Weekly availability <span class="text-caption text-medium-emphasis">({{ form.timezone }})</span></div>
            <v-card>
                <v-list v-if="profile.availability?.length">
                    <v-list-item v-for="rule in profile.availability" :key="rule.id" :title="`${dayNames[rule.day_of_week]} · ${rule.start_time}–${rule.end_time}`">
                        <template #append>
                            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="actions.removeAvailability.mutate(rule.id)" />
                        </template>
                    </v-list-item>
                </v-list>
                <div class="pa-4 d-flex flex-wrap ga-2 align-center">
                    <v-select v-model="av.day_of_week" :items="dayNames.map((d, i) => ({ title: d, value: i }))" label="Day" density="compact" hide-details style="min-width: 140px" />
                    <v-text-field v-model="av.start_time" label="From" type="time" density="compact" hide-details style="max-width: 130px" />
                    <v-text-field v-model="av.end_time" label="To" type="time" density="compact" hide-details style="max-width: 130px" />
                    <v-btn color="primary" variant="tonal" :loading="actions.addAvailability.isPending.value" @click="addAvailability">Add</v-btn>
                </div>
            </v-card>
        </template>

        <v-alert v-else-if="!isLoading" type="info" variant="tonal" class="mt-2">
            Save your profile first to add services and availability.
        </v-alert>
    </div>
</template>
