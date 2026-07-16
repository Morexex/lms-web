<script setup lang="ts">
import type { CmsContent, CmsContentType, MenuItem } from '~/types/cms'

definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()
const canManage = computed(() => can('members.manage'))

const type = ref<CmsContentType>('page')
const { data: contents, isLoading } = useCmsContents(type)
const actions = useCmsActions()

const editing = ref<CmsContent | null>(null)
const showEditor = ref(false)
const { message, handle, reset } = useApiErrors()

function openNew(): void {
    editing.value = null
    showEditor.value = true
}
function openEdit(content: CmsContent): void {
    editing.value = content
    showEditor.value = true
}

async function togglePublish(content: CmsContent): Promise<void> {
    reset()
    try {
        if (content.status === 'published') await actions.unpublish.mutateAsync(content.id)
        else await actions.publish.mutateAsync(content.id)
    } catch (error) {
        handle(error)
    }
}

async function remove(content: CmsContent): Promise<void> {
    reset()
    try {
        await actions.remove.mutateAsync(content.id)
    } catch (error) {
        handle(error)
    }
}

// --- Menu builder ---
const { data: menu } = useCmsMenu()
const saveMenu = useSaveCmsMenu()
const menuItems = ref<MenuItem[]>([])
watch(menu, (value) => { if (value) menuItems.value = value.map((m) => ({ ...m })) }, { immediate: true })

function addMenuItem(): void {
    menuItems.value.push({ label: '', url: '' })
}
function removeMenuItem(index: number): void {
    menuItems.value.splice(index, 1)
}
async function persistMenu(): Promise<void> {
    reset()
    try {
        await saveMenu.mutateAsync(menuItems.value.filter((m) => m.label.trim() && m.url.trim()))
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 900px">
        <AppPageHeader title="Website" subtitle="Pages, blog posts, and navigation for your public site">
            <template v-if="canManage && institution.activeSlug" #actions>
                <v-btn
                    variant="tonal"
                    color="secondary"
                    prepend-icon="mdi-open-in-new"
                    :href="`/site/${institution.activeSlug}`"
                    target="_blank"
                >
                    View site
                </v-btn>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="openNew">New {{ type }}</v-btn>
            </template>
        </AppPageHeader>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">Select an institution to manage its website.</v-alert>
        <v-alert v-else-if="!canManage" type="warning" variant="tonal">You need admin access to manage the website.</v-alert>

        <template v-else>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

            <v-btn-toggle v-model="type" mandatory density="comfortable" color="primary" class="mb-4">
                <v-btn value="page" prepend-icon="mdi-file-document">Pages</v-btn>
                <v-btn value="post" prepend-icon="mdi-post">Blog posts</v-btn>
            </v-btn-toggle>

            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-card v-if="contents?.length" class="mb-6">
                <v-table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th class="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in contents" :key="c.id">
                            <td class="font-weight-medium">{{ c.title }}</td>
                            <td class="text-medium-emphasis">/{{ c.slug }}</td>
                            <td>
                                <v-chip :color="c.status === 'published' ? 'success' : 'default'" size="small" variant="tonal">
                                    {{ c.status }}
                                </v-chip>
                            </td>
                            <td class="text-right">
                                <v-btn
                                    size="small"
                                    variant="text"
                                    :color="c.status === 'published' ? 'warning' : 'success'"
                                    :loading="actions.publish.isPending.value || actions.unpublish.isPending.value"
                                    @click="togglePublish(c)"
                                >
                                    {{ c.status === 'published' ? 'Unpublish' : 'Publish' }}
                                </v-btn>
                                <v-btn size="small" variant="text" icon="mdi-pencil" @click="openEdit(c)" />
                                <v-btn size="small" variant="text" icon="mdi-delete" color="error" @click="remove(c)" />
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-file-document-plus"
                :title="`No ${type}s yet`"
                :description="`Create your first ${type} — it stays a draft until you publish it.`"
            />

            <!-- Menu builder -->
            <v-card class="pa-5">
                <div class="d-flex align-center mb-3">
                    <h2 class="text-subtitle-1 font-weight-bold mb-0">
                        <v-icon icon="mdi-menu" size="small" class="mr-1" /> Navigation menu
                    </h2>
                    <v-spacer />
                    <v-btn size="small" variant="text" prepend-icon="mdi-plus" @click="addMenuItem">Add link</v-btn>
                </div>
                <div v-for="(item, i) in menuItems" :key="i" class="d-flex align-center ga-2 mb-2">
                    <v-text-field v-model="item.label" label="Label" density="compact" hide-details style="max-width: 220px" />
                    <v-text-field v-model="item.url" label="URL" placeholder="/about" density="compact" hide-details />
                    <v-btn icon="mdi-close" variant="text" size="small" @click="removeMenuItem(i)" />
                </div>
                <p v-if="!menuItems.length" class="text-body-2 text-medium-emphasis">No menu links yet.</p>
                <div class="d-flex justify-end mt-2">
                    <v-btn color="primary" variant="tonal" :loading="saveMenu.isPending.value" @click="persistMenu">Save menu</v-btn>
                </div>
            </v-card>
        </template>

        <CmsEditorDialog
            v-if="showEditor"
            :content="editing"
            :type="type"
            @close="showEditor = false"
        />
    </div>
</template>
