<script setup lang="ts">
const props = defineProps<{ courseId: string }>()
const emit = defineEmits<{ close: [] }>()

const announce = useAnnounceCourse(props.courseId)
const { message, handle, reset } = useApiErrors()

const title = ref('')
const body = ref('')

async function post(): Promise<void> {
    if (!title.value.trim() || !body.value.trim()) return
    reset()
    try {
        await announce.mutateAsync({ title: title.value, body: body.value })
        emit('close')
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="520" @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Announce to enrolled learners</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
                <v-text-field v-model="title" label="Title" density="compact" class="mb-2" hide-details />
                <v-textarea v-model="body" label="Message" rows="3" auto-grow density="compact" hide-details />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="emit('close')">Cancel</v-btn>
                <v-btn color="primary" :loading="announce.isPending.value" @click="post">Send</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
