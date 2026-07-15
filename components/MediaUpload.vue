<script setup lang="ts">
import type { MediaItem } from '~/types/media'

defineProps<{ accept?: string; label?: string }>()
const emit = defineEmits<{ uploaded: [media: MediaItem] }>()

const upload = useUploadMedia()
const { message, handle, reset } = useApiErrors()

async function onSelect(value: File | File[] | null): Promise<void> {
    const file = Array.isArray(value) ? value[0] : value
    if (!file) return

    reset()
    try {
        const media = await upload.mutateAsync(file)
        emit('uploaded', media)
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div>
        <v-file-input
            :label="label ?? 'Upload a file'"
            :accept="accept"
            :loading="upload.isPending.value"
            prepend-icon="mdi-upload"
            density="compact"
            hide-details
            @update:model-value="onSelect"
        />
        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mt-1">{{ message }}</v-alert>
    </div>
</template>
