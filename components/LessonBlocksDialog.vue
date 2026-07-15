<script setup lang="ts">
import type { ContentBlock } from '~/types/learning'
import type { MediaItem } from '~/types/media'

const props = defineProps<{ lessonId: string }>()
const emit = defineEmits<{ close: [] }>()

const { data: lesson, isLoading } = useLesson(props.lessonId)
const blocks = useBlockActions(props.lessonId)
const { message, handle, reset } = useApiErrors()

const newType = ref<'rich_text' | 'embed' | 'video' | 'resource'>('rich_text')
const newHtml = ref('')
const newUrl = ref('')
const pendingMedia = ref<MediaItem | null>(null)

const needsMedia = computed(() => newType.value === 'video' || newType.value === 'resource')

function contentFor(): Record<string, unknown> {
    if (newType.value === 'rich_text') return { html: newHtml.value }
    if (newType.value === 'embed') return { url: newUrl.value, provider: 'youtube' }
    return { media_id: pendingMedia.value?.id, filename: pendingMedia.value?.original_name }
}

async function addBlock(): Promise<void> {
    reset()
    if (needsMedia.value && !pendingMedia.value) {
        handle({ response: { data: { message: 'Upload a file first.' } } })
        return
    }
    try {
        await blocks.create.mutateAsync({ type: newType.value, content: contentFor() })
        newHtml.value = ''
        newUrl.value = ''
        pendingMedia.value = null
    } catch (error) {
        handle(error)
    }
}

async function saveBlock(block: ContentBlock, content: Record<string, unknown>): Promise<void> {
    reset()
    try {
        await blocks.update.mutateAsync({ id: block.id, content })
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="720" scrollable @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Lesson content — {{ lesson?.title }}</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>

            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
                <v-progress-linear v-if="isLoading" indeterminate color="primary" />

                <div v-for="block in lesson?.blocks ?? []" :key="block.id" class="mb-4">
                    <div class="d-flex align-center mb-1">
                        <v-chip size="x-small" variant="tonal" class="mr-2">{{ block.type }}</v-chip>
                        <v-spacer />
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="blocks.remove.mutate(block.id)" />
                    </div>
                    <v-textarea
                        v-if="block.type === 'rich_text'"
                        :model-value="String(block.content?.html ?? '')"
                        label="HTML"
                        rows="3"
                        auto-grow
                        hide-details
                        @update:model-value="(v) => saveBlock(block, { html: v })"
                    />
                    <v-text-field
                        v-else-if="block.type === 'embed'"
                        :model-value="String(block.content?.url ?? '')"
                        label="Embed URL"
                        hide-details
                        @update:model-value="(v) => saveBlock(block, { url: v, provider: 'youtube' })"
                    />
                    <div v-else-if="block.type === 'video'">
                        <video v-if="block.media_url" :src="block.media_url" controls style="max-width: 100%; border-radius: 8px" />
                    </div>
                    <div v-else-if="block.type === 'resource'">
                        <v-btn :href="block.media_url ?? undefined" target="_blank" variant="tonal" prepend-icon="mdi-file-download">
                            {{ String(block.content?.filename ?? 'Download') }}
                        </v-btn>
                    </div>
                </div>

                <v-divider class="my-4" />

                <div class="text-subtitle-2 font-weight-bold mb-2">Add a block</div>
                <v-btn-toggle v-model="newType" mandatory density="compact" class="mb-3">
                    <v-btn value="rich_text" size="small">Text</v-btn>
                    <v-btn value="embed" size="small">Embed</v-btn>
                    <v-btn value="video" size="small">Video</v-btn>
                    <v-btn value="resource" size="small">File</v-btn>
                </v-btn-toggle>
                <v-textarea v-if="newType === 'rich_text'" v-model="newHtml" label="HTML content" rows="2" auto-grow hide-details class="mb-2" />
                <v-text-field v-else-if="newType === 'embed'" v-model="newUrl" label="Embed URL (YouTube/Vimeo)" hide-details class="mb-2" />
                <div v-else class="mb-2">
                    <MediaUpload
                        :accept="newType === 'video' ? 'video/*' : undefined"
                        :label="newType === 'video' ? 'Upload video' : 'Upload file'"
                        @uploaded="(m) => (pendingMedia = m)"
                    />
                    <p v-if="pendingMedia" class="text-caption text-success mt-1">Ready: {{ pendingMedia.original_name }}</p>
                </div>
                <v-btn color="primary" :loading="blocks.create.isPending.value" @click="addBlock">Add block</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
