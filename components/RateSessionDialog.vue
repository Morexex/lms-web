<script setup lang="ts">
import type { Booking } from '~/types/mentorship'

const props = defineProps<{ booking: Booking }>()
const emit = defineEmits<{ close: [] }>()

const { rate } = useSessionActions()
const { message, handle, reset } = useApiErrors()

const stars = ref(5)
const comment = ref('')

async function submit(): Promise<void> {
    reset()
    try {
        await rate.mutateAsync({ id: props.booking.id, stars: stars.value, comment: comment.value || null })
        emit('close')
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="440" @update:model-value="emit('close')">
        <v-card>
            <v-card-title>Rate your session</v-card-title>
            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
                <p class="text-body-2 text-medium-emphasis mb-2">How was your session with {{ booking.mentor?.name }}?</p>
                <div class="mb-3">
                    <StarRating :value="stars" editable @update:value="(v) => (stars = v)" />
                </div>
                <v-textarea v-model="comment" label="Comment (optional)" rows="3" auto-grow density="compact" hide-details />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="emit('close')">Cancel</v-btn>
                <v-btn color="primary" :loading="rate.isPending.value" @click="submit">Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
