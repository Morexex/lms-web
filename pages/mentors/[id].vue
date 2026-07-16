<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { data: mentor, isLoading } = useMentor(id)
const book = useBookSession(id)
const { message, handle, reset } = useApiErrors()

const viewerTz = Intl.DateTimeFormat().resolvedOptions().timeZone
const selectedService = ref<string | null>(null)
const booked = ref(false)
const payInstructions = ref('')

function priceLabel(s: { is_free: boolean; price_currency: string | null; price_amount: number | null }): string {
    return s.is_free ? 'Free' : `${s.price_currency} ${s.price_amount}`
}

async function pick(startsAt: string): Promise<void> {
    if (!selectedService.value) return
    reset()
    booked.value = false
    payInstructions.value = ''
    try {
        const result = await book.mutateAsync({ service_id: selectedService.value, starts_at: startsAt, mentee_timezone: viewerTz })
        selectedService.value = null
        if (result.checkout?.redirect_url) {
            await navigateTo(result.checkout.redirect_url, { external: true })
            return
        }
        if (result.checkout?.instructions) {
            payInstructions.value = result.checkout.instructions
            return
        }
        booked.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/mentors" class="mb-2">All mentors</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <template v-if="mentor">
            <div class="d-flex align-center mb-4">
                <v-avatar size="56" color="primary" variant="tonal" class="mr-3">{{ (mentor.mentor?.name ?? '?').charAt(0) }}</v-avatar>
                <div>
                    <h1 class="text-h5 font-weight-bold">{{ mentor.mentor?.name }}</h1>
                    <div class="text-body-2 text-medium-emphasis">{{ mentor.headline }}</div>
                </div>
            </div>
            <p v-if="mentor.bio" class="text-body-1 mb-4" style="white-space: pre-wrap">{{ mentor.bio }}</p>

            <v-alert v-if="booked" type="success" variant="tonal" density="compact" class="mb-4">
                Session booked! Find it under <NuxtLink to="/mentorship/sessions">My sessions</NuxtLink>.
            </v-alert>
            <v-alert v-if="payInstructions" type="info" variant="tonal" density="compact" class="mb-4">
                {{ payInstructions }} Track it under <NuxtLink to="/orders">Orders</NuxtLink>.
            </v-alert>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <h2 class="text-h6 font-weight-bold mb-2">Services</h2>
            <AppEmptyState
                v-if="!(mentor.services?.length)"
                icon="mdi-calendar-blank"
                title="No services offered yet"
                description="This mentor hasn't published any bookable services."
            />
            <v-card v-for="s in mentor.services ?? []" :key="s.id" class="pa-4 mb-3" variant="outlined">
                <div class="d-flex align-center">
                    <div>
                        <div class="font-weight-medium">{{ s.title }}</div>
                        <div class="text-caption text-medium-emphasis">{{ s.duration_minutes }} min · {{ priceLabel(s) }}</div>
                    </div>
                    <v-spacer />
                    <v-btn v-if="selectedService !== s.id" color="primary" variant="tonal" @click="selectedService = s.id">
                        Choose a time
                    </v-btn>
                    <v-btn v-else variant="text" @click="selectedService = null">Hide times</v-btn>
                </div>
                <p v-if="s.description" class="text-body-2 text-medium-emphasis mt-2 mb-0">{{ s.description }}</p>

                <div v-if="selectedService === s.id" class="mt-3">
                    <v-divider class="mb-3" />
                    <SlotPicker :profile-id="mentor.id" :service-id="s.id" :timezone="viewerTz" @select="pick" />
                </div>
            </v-card>
        </template>
    </div>
</template>
