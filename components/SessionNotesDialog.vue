<script setup lang="ts">
const props = defineProps<{ bookingId: string }>()
const emit = defineEmits<{ close: [] }>()

const idRef = computed(() => props.bookingId)
const { data: notes, isLoading } = useSessionNotes(idRef)
const save = useSaveNotes(props.bookingId)
const { message, handle, reset } = useApiErrors()

const body = ref('')
const saved = ref(false)
watch(notes, (value) => { if (value) body.value = value.body }, { immediate: true })

async function submit(): Promise<void> {
    reset()
    saved.value = false
    try {
        await save.mutateAsync(body.value)
        saved.value = true
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="480" @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Private notes</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <p class="text-caption text-medium-emphasis mb-2">Only you can see these notes.</p>
                <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-3">Saved.</v-alert>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
                <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-2" />
                <v-textarea v-model="body" label="Notes" rows="5" auto-grow density="compact" hide-details />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="emit('close')">Close</v-btn>
                <v-btn color="primary" :loading="save.isPending.value" @click="submit">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
