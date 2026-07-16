<script setup lang="ts">
import type { CmsContent, CmsContentType } from '~/types/cms'

const props = defineProps<{ content?: CmsContent | null; type: CmsContentType }>()
const emit = defineEmits<{ close: [] }>()

const actions = useCmsActions()
const institution = useInstitutionStore()
const { message, handle, reset } = useApiErrors()

const isEdit = computed(() => Boolean(props.content))
const form = reactive({
    title: props.content?.title ?? '',
    slug: props.content?.slug ?? '',
    body: props.content?.body ?? '',
    seo_title: props.content?.seo_title ?? '',
    seo_description: props.content?.seo_description ?? '',
})

const base = computed(() => `lumen.app/site/${institution.activeSlug ?? '…'}`)
const previewUrl = computed(() =>
    `${base.value}/${props.type === 'post' ? 'blog/' : ''}${form.slug || 'slug'}`,
)

async function save(): Promise<void> {
    if (!form.title.trim() || !form.body.trim()) return
    reset()
    try {
        const payload = {
            title: form.title,
            slug: form.slug || undefined,
            body: form.body,
            seo_title: form.seo_title || null,
            seo_description: form.seo_description || null,
        }
        if (isEdit.value && props.content) {
            await actions.update.mutateAsync({ id: props.content.id, data: payload })
        } else {
            await actions.create.mutateAsync({ ...payload, type: props.type })
        }
        emit('close')
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="720" scrollable @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>{{ isEdit ? 'Edit' : 'New' }} {{ type }}</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>

                <v-text-field v-model="form.title" label="Title" density="compact" class="mb-2" hide-details />
                <v-text-field
                    v-model="form.slug"
                    label="Slug (optional — auto-generated from title)"
                    placeholder="about-our-academy"
                    density="compact"
                    class="mb-2"
                    hide-details
                    hint="Lowercase letters, numbers and hyphens only"
                />
                <v-textarea v-model="form.body" label="Body (HTML)" rows="8" auto-grow density="compact" class="mb-3" hide-details />

                <div class="text-subtitle-2 font-weight-bold mb-2">SEO</div>
                <v-text-field v-model="form.seo_title" label="SEO title" density="compact" class="mb-2" hide-details />
                <v-textarea
                    v-model="form.seo_description"
                    label="SEO description"
                    rows="2"
                    auto-grow
                    density="compact"
                    counter="300"
                    maxlength="300"
                    class="mb-3"
                />
                <SeoSnippet :title="form.seo_title || form.title || 'Untitled'" :url="previewUrl" :description="form.seo_description" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn variant="text" @click="emit('close')">Cancel</v-btn>
                <v-btn
                    color="primary"
                    :loading="actions.create.isPending.value || actions.update.isPending.value"
                    @click="save"
                >
                    {{ isEdit ? 'Save' : 'Create draft' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
