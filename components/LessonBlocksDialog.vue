<script setup lang="ts">
import type { ContentBlock } from '~/types/learning'

const props = defineProps<{ lessonId: string }>()
const emit = defineEmits<{ close: [] }>()

const { data: lesson, isLoading } = useLesson(props.lessonId)
const blocks = useBlockActions(props.lessonId)
const { message, handle, reset } = useApiErrors()

const newType = ref<'rich_text' | 'embed'>('rich_text')
const newHtml = ref('')
const newUrl = ref('')

async function addBlock(): Promise<void> {
    reset()
    const content = newType.value === 'rich_text' ? { html: newHtml.value } : { url: newUrl.value, provider: 'youtube' }
    try {
        await blocks.create.mutateAsync({ type: newType.value, content })
        newHtml.value = ''
        newUrl.value = ''
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
                </div>

                <v-divider class="my-4" />

                <div class="text-subtitle-2 font-weight-bold mb-2">Add a block</div>
                <v-btn-toggle v-model="newType" mandatory density="compact" class="mb-3">
                    <v-btn value="rich_text" size="small">Text</v-btn>
                    <v-btn value="embed" size="small">Embed</v-btn>
                </v-btn-toggle>
                <v-textarea v-if="newType === 'rich_text'" v-model="newHtml" label="HTML content" rows="2" auto-grow hide-details class="mb-2" />
                <v-text-field v-else v-model="newUrl" label="Embed URL (YouTube/Vimeo)" hide-details class="mb-2" />
                <v-btn color="primary" :loading="blocks.create.isPending.value" @click="addBlock">Add block</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
