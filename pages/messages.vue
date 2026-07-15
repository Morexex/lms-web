<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const institution = useInstitutionStore()
const { data: conversations, isLoading } = useConversations()
const selectedId = ref<string | null>(null)
const { data: messages } = useConversationMessages(selectedId)
const send = useSendMessage(selectedId)
const start = useStartConversation()
const { message: err, handle, reset } = useApiErrors()

const draft = ref('')

// Deep link: /messages?to=<userPublicId> opens (or starts) that conversation.
onMounted(async () => {
    const to = typeof route.query.to === 'string' ? route.query.to : null
    if (!to) return
    try {
        const conversation = await start.mutateAsync({ user_id: to })
        selectedId.value = conversation.id
    } catch (error) {
        handle(error)
    }
})

// Auto-select the most recent conversation once the list loads.
watch(conversations, (list) => {
    if (!selectedId.value && list?.length) selectedId.value = list[0]!.id
})

const selected = computed(() => conversations.value?.find((c) => c.id === selectedId.value) ?? null)

async function submit(): Promise<void> {
    if (!draft.value.trim() || !selectedId.value) return
    reset()
    try {
        await send.mutateAsync(draft.value)
        draft.value = ''
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div>
        <AppPageHeader title="Messages" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to see your conversations.
        </v-alert>

        <template v-else>
            <v-alert v-if="err" type="error" variant="tonal" density="compact" class="mb-4">{{ err }}</v-alert>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <AppEmptyState
                v-if="!isLoading && !conversations?.length"
                icon="mdi-message-outline"
                title="No conversations yet"
                description="Start a conversation from the People page by messaging a member."
            >
                <template #action>
                    <v-btn color="primary" variant="tonal" to="/people">Go to People</v-btn>
                </template>
            </AppEmptyState>

            <v-row v-else>
                <!-- Conversation list -->
                <v-col cols="12" md="4">
                    <v-card>
                        <v-list>
                            <v-list-item
                                v-for="c in conversations"
                                :key="c.id"
                                :active="c.id === selectedId"
                                :title="c.other_participant?.name ?? 'Conversation'"
                                @click="selectedId = c.id"
                            >
                                <template #subtitle>
                                    <span v-if="c.last_message">{{ c.last_message.mine ? 'You: ' : '' }}{{ c.last_message.body }}</span>
                                </template>
                                <template #append>
                                    <v-badge v-if="c.unread_count" :content="c.unread_count" color="primary" inline />
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <!-- Thread -->
                <v-col cols="12" md="8">
                    <v-card class="d-flex flex-column" style="height: 560px">
                        <v-card-title v-if="selected" class="text-subtitle-1 font-weight-bold">
                            {{ selected.other_participant?.name }}
                        </v-card-title>
                        <v-divider />

                        <div class="flex-grow-1 pa-4" style="overflow-y: auto">
                            <div v-for="m in messages ?? []" :key="m.id" class="d-flex mb-2" :class="m.mine ? 'justify-end' : 'justify-start'">
                                <div
                                    class="px-3 py-2 rounded-lg"
                                    :class="m.mine ? 'bg-primary text-white' : 'bg-surface-variant'"
                                    style="max-width: 75%"
                                >
                                    <p class="text-body-2 mb-0" style="white-space: pre-wrap">{{ m.body }}</p>
                                </div>
                            </div>
                            <p v-if="selectedId && !(messages ?? []).length" class="text-center text-body-2 text-medium-emphasis">
                                No messages yet — say hello.
                            </p>
                        </div>

                        <v-divider />
                        <div class="d-flex ga-2 pa-3">
                            <v-text-field
                                v-model="draft"
                                placeholder="Write a message…"
                                density="compact"
                                hide-details
                                :disabled="!selectedId"
                                @keyup.enter="submit"
                            />
                            <v-btn color="primary" icon="mdi-send" :loading="send.isPending.value" :disabled="!selectedId" @click="submit" />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
