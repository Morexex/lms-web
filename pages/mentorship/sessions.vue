<script setup lang="ts">
import type { Booking } from '~/types/mentorship'

definePageMeta({ middleware: 'auth' })

const { data: mine, isLoading } = useMyBookings()
const { data: mentoring } = useMentorBookings()
const { cancel } = useSessionActions()
const { message, handle, reset } = useApiErrors()

const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone
const rescheduling = ref<Booking | null>(null)
const rating = ref<Booking | null>(null)
const noting = ref<string | null>(null)

function fmt(iso: string): string {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
function upcoming(b: Booking): boolean {
    return b.status === 'confirmed' && new Date(b.starts_at) > new Date()
}
function finished(b: Booking): boolean {
    return b.status !== 'cancelled' && new Date(b.ends_at) < new Date()
}
const statusColor: Record<string, string> = { confirmed: 'success', completed: 'primary', cancelled: 'error' }

async function doCancel(id: string): Promise<void> {
    reset()
    try {
        await cancel.mutateAsync(id)
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 820px">
        <AppPageHeader title="My sessions" subtitle="Your mentoring bookings">
            <template #actions>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-account-search" to="/mentors">Find a mentor</v-btn>
            </template>
        </AppPageHeader>

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <!-- As a mentee -->
        <div class="text-subtitle-2 font-weight-bold mb-2">Sessions I've booked</div>
        <v-card v-if="mine?.length" class="mb-6">
            <template v-for="(b, i) in mine" :key="b.id">
                <v-divider v-if="i > 0" />
                <div class="pa-4">
                    <div class="d-flex align-center flex-wrap ga-2">
                        <div>
                            <div class="font-weight-medium">{{ b.service?.title }} · {{ b.mentor?.name }}</div>
                            <div class="text-caption text-medium-emphasis">{{ fmt(b.starts_at) }}</div>
                        </div>
                        <v-spacer />
                        <v-chip :color="statusColor[b.status]" size="small" variant="tonal">{{ b.status }}</v-chip>
                    </div>
                    <div class="d-flex flex-wrap ga-2 mt-3">
                        <template v-if="upcoming(b)">
                            <v-btn size="small" variant="tonal" prepend-icon="mdi-calendar-edit" @click="rescheduling = b">Reschedule</v-btn>
                            <v-btn size="small" variant="text" color="error" prepend-icon="mdi-close" @click="doCancel(b.id)">Cancel</v-btn>
                        </template>
                        <v-btn v-if="b.status !== 'cancelled'" size="small" variant="text" prepend-icon="mdi-calendar-export" @click="downloadCalendar(b.id)">Calendar</v-btn>
                        <v-btn v-if="finished(b) && !b.rating" size="small" variant="tonal" color="amber" prepend-icon="mdi-star" @click="rating = b">Rate</v-btn>
                        <div v-if="b.rating" class="d-flex align-center ga-2">
                            <StarRating :value="b.rating.stars" />
                            <span class="text-caption text-medium-emphasis">{{ b.rating.comment }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </v-card>
        <AppEmptyState
            v-else-if="!isLoading"
            icon="mdi-calendar-blank-outline"
            title="No booked sessions"
            description="Find a mentor and book a session to see it here."
        />

        <!-- As a mentor -->
        <div v-if="mentoring?.length" class="text-subtitle-2 font-weight-bold mb-2">Sessions I'm mentoring</div>
        <v-card v-if="mentoring?.length">
            <template v-for="(b, i) in mentoring" :key="b.id">
                <v-divider v-if="i > 0" />
                <div class="pa-4">
                    <div class="d-flex align-center flex-wrap ga-2">
                        <div>
                            <div class="font-weight-medium">{{ b.service?.title }} · {{ b.mentee?.name }}</div>
                            <div class="text-caption text-medium-emphasis">{{ fmt(b.starts_at) }}</div>
                        </div>
                        <v-spacer />
                        <v-chip :color="statusColor[b.status]" size="small" variant="tonal">{{ b.status }}</v-chip>
                    </div>
                    <div class="d-flex flex-wrap ga-2 mt-3">
                        <template v-if="upcoming(b)">
                            <v-btn size="small" variant="tonal" prepend-icon="mdi-calendar-edit" @click="rescheduling = b">Reschedule</v-btn>
                            <v-btn size="small" variant="text" color="error" prepend-icon="mdi-close" @click="doCancel(b.id)">Cancel</v-btn>
                        </template>
                        <v-btn size="small" variant="text" prepend-icon="mdi-note-text" @click="noting = b.id">Notes</v-btn>
                        <div v-if="b.rating" class="d-flex align-center ga-2">
                            <StarRating :value="b.rating.stars" />
                            <span class="text-caption text-medium-emphasis">{{ b.rating.comment }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </v-card>

        <RescheduleDialog v-if="rescheduling" :key="rescheduling.id" :booking="rescheduling" :timezone="viewerTz" @close="rescheduling = null" />
        <RateSessionDialog v-if="rating" :key="rating.id" :booking="rating" @close="rating = null" />
        <SessionNotesDialog v-if="noting" :key="noting" :booking-id="noting" @close="noting = null" />
    </div>
</template>
