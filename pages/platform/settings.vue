<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const tab = ref<'settings' | 'flags' | 'audit'>('settings')

// --- Billing settings ---
const { data: settings, isLoading: loadingSettings } = usePlatformSettings()
const saveSettings = useSavePlatformSettings()
const { message, handle, reset } = useApiErrors()
const feeInput = ref<number>(10)
const gatewayInput = ref<string>('sandbox')
const savedFlash = ref(false)

watch(settings, (value) => {
    if (value) {
        feeInput.value = value.platform_fee_percent
        gatewayInput.value = value.default_gateway
    }
}, { immediate: true })

async function saveBilling(): Promise<void> {
    reset()
    try {
        await saveSettings.mutateAsync({ platform_fee_percent: Number(feeInput.value), default_gateway: gatewayInput.value })
        savedFlash.value = true
        setTimeout(() => (savedFlash.value = false), 2500)
    } catch (error) {
        handle(error)
    }
}

// --- Feature flags ---
const { data: flags } = useFeatureFlags()
const toggleFlag = useToggleFeatureFlag()

async function onToggle(key: string, enabled: boolean | null): Promise<void> {
    reset()
    try {
        await toggleFlag.mutateAsync({ key, enabled: Boolean(enabled) })
    } catch (error) {
        handle(error)
    }
}

// --- Audit log ---
const auditFilters = ref({ action: '', page: 1 })
const { data: audit, isLoading: loadingAudit } = useAuditLogs(auditFilters)

function formatWhen(iso: string | null): string {
    return iso ? new Date(iso).toLocaleString() : ''
}
</script>

<template>
    <div style="max-width: 900px">
        <AppPageHeader title="Platform" subtitle="Settings, feature flags, and the audit trail" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>

        <v-tabs v-model="tab" color="primary" class="mb-4">
            <v-tab value="settings" prepend-icon="mdi-cog">Settings</v-tab>
            <v-tab value="flags" prepend-icon="mdi-flag">Feature flags</v-tab>
            <v-tab value="audit" prepend-icon="mdi-history">Audit log</v-tab>
        </v-tabs>

        <!-- Settings -->
        <v-window v-model="tab">
            <v-window-item value="settings">
                <v-card class="pa-5" max-width="520">
                    <v-progress-linear v-if="loadingSettings" indeterminate color="primary" class="mb-3" />
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">Billing</h2>

                    <v-text-field
                        v-model.number="feeInput"
                        label="Platform fee (%)"
                        type="number"
                        min="0"
                        max="100"
                        variant="outlined"
                        density="comfortable"
                        hint="Commission taken from each order"
                        persistent-hint
                        class="mb-4"
                    />
                    <v-select
                        v-model="gatewayInput"
                        :items="settings?.available_gateways ?? []"
                        label="Default payment gateway"
                        variant="outlined"
                        density="comfortable"
                        class="mb-2"
                    />

                    <div class="d-flex align-center ga-3 mt-2">
                        <v-btn color="primary" :loading="saveSettings.isPending.value" @click="saveBilling">Save</v-btn>
                        <v-fade-transition>
                            <span v-if="savedFlash" class="text-success text-body-2">
                                <v-icon icon="mdi-check" size="small" /> Saved — applies to the next order
                            </span>
                        </v-fade-transition>
                    </div>
                </v-card>
            </v-window-item>

            <!-- Feature flags -->
            <v-window-item value="flags">
                <v-card>
                    <v-list>
                        <v-list-item v-for="flag in flags" :key="flag.key">
                            <v-list-item-title class="font-weight-medium">{{ flag.label }}</v-list-item-title>
                            <v-list-item-subtitle>{{ flag.description }}</v-list-item-subtitle>
                            <template #append>
                                <v-switch
                                    :model-value="flag.enabled"
                                    color="primary"
                                    density="compact"
                                    hide-details
                                    :loading="toggleFlag.isPending.value"
                                    @update:model-value="(v) => onToggle(flag.key, v)"
                                />
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-window-item>

            <!-- Audit log -->
            <v-window-item value="audit">
                <v-text-field
                    v-model="auditFilters.action"
                    label="Filter by action (e.g. payment, auth, platform)"
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    clearable
                    class="mb-3"
                    @update:model-value="auditFilters.page = 1"
                />
                <v-progress-linear v-if="loadingAudit" indeterminate color="primary" class="mb-3" />

                <v-card v-if="audit?.data.length">
                    <v-table density="comfortable">
                        <thead>
                            <tr>
                                <th>When</th>
                                <th>Action</th>
                                <th>Actor</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in audit.data" :key="log.id">
                                <td class="text-caption text-medium-emphasis">{{ formatWhen(log.created_at) }}</td>
                                <td><AuditActionChip :action="log.action" /></td>
                                <td>
                                    <span v-if="log.actor">{{ log.actor.name }}</span>
                                    <span v-else class="text-disabled">system</span>
                                </td>
                                <td class="text-caption text-medium-emphasis">{{ log.ip ?? '—' }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div v-if="audit.meta.last_page > 1" class="d-flex align-center justify-space-between pa-3">
                        <span class="text-caption text-medium-emphasis">
                            Page {{ audit.meta.current_page }} of {{ audit.meta.last_page }} · {{ audit.meta.total }} entries
                        </span>
                        <div>
                            <v-btn
                                size="small"
                                variant="text"
                                :disabled="auditFilters.page <= 1"
                                @click="auditFilters.page--"
                            >
                                Previous
                            </v-btn>
                            <v-btn
                                size="small"
                                variant="text"
                                :disabled="auditFilters.page >= audit.meta.last_page"
                                @click="auditFilters.page++"
                            >
                                Next
                            </v-btn>
                        </div>
                    </div>
                </v-card>
                <AppEmptyState
                    v-else-if="!loadingAudit"
                    icon="mdi-history"
                    title="No matching audit entries"
                    description="Sensitive actions appear here as they happen."
                />
            </v-window-item>
        </v-window>
    </div>
</template>
