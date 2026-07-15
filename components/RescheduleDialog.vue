<script setup lang="ts">
import type { Booking } from '~/types/mentorship'

const props = defineProps<{ booking: Booking; timezone: string }>()
const emit = defineEmits<{ close: [] }>()

const { reschedule } = useSessionActions()
const { message, handle, reset } = useApiErrors()

async function pick(startsAt: string): Promise<void> {
    reset()
    try {
        await reschedule.mutateAsync({ id: props.booking.id, starts_at: startsAt })
        emit('close')
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="560" scrollable @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Reschedule session</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
                <SlotPicker
                    v-if="booking.mentor_profile_id && booking.service"
                    :profile-id="booking.mentor_profile_id"
                    :service-id="booking.service.id"
                    :timezone="timezone"
                    @select="pick"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
