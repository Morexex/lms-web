<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: mentors, isLoading } = useMentors()

function priceLabel(service: { is_free: boolean; price_currency: string | null; price_amount: number | null }): string {
    return service.is_free ? 'Free' : `${service.price_currency} ${service.price_amount}`
}
</script>

<template>
    <div>
        <AppPageHeader title="Find a mentor" subtitle="Book 1-to-1 time with mentors across LUMEN">
            <template #actions>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-account-tie" to="/mentorship/profile">Become a mentor</v-btn>
                <v-btn variant="tonal" color="primary" prepend-icon="mdi-calendar-account" to="/mentorship/sessions">My sessions</v-btn>
            </template>
        </AppPageHeader>

        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-row>
            <v-col v-for="m in mentors" :key="m.id" cols="12" sm="6" md="4">
                <v-card class="pa-4 h-100 d-flex flex-column" :to="`/mentors/${m.id}`" hover>
                    <div class="d-flex align-center mb-2">
                        <v-avatar color="primary" variant="tonal" class="mr-2">{{ (m.mentor?.name ?? '?').charAt(0) }}</v-avatar>
                        <div>
                            <div class="font-weight-bold">{{ m.mentor?.name }}</div>
                            <div class="text-caption text-medium-emphasis">{{ m.headline }}</div>
                        </div>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">
                        {{ m.bio }}
                    </p>
                    <v-spacer />
                    <div class="d-flex flex-wrap ga-1 mt-2">
                        <v-chip
                            v-for="s in m.services ?? []"
                            :key="s.id"
                            size="x-small"
                            variant="tonal"
                            :color="s.is_free ? 'success' : 'secondary'"
                        >
                            {{ priceLabel(s) }}
                        </v-chip>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <AppEmptyState
            v-if="!isLoading && !mentors?.length"
            icon="mdi-account-search-outline"
            title="No mentors yet"
            description="Check back soon, or publish your own mentor profile to join the marketplace."
        />
    </div>
</template>
