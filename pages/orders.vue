<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: orders, isLoading } = useMyOrders()
const { message, handle, reset } = useApiErrors()

function fmt(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''
}

async function download(id: string): Promise<void> {
    reset()
    try {
        await downloadInvoice(id)
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <div style="max-width: 720px">
        <AppPageHeader title="My orders" subtitle="Payments and receipts" />

        <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-4">{{ message }}</v-alert>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-card v-if="orders?.length">
            <v-list>
                <v-list-item v-for="o in orders" :key="o.id" :title="o.description">
                    <template #subtitle>
                        {{ formatMoney(o.amount, o.currency) }} · {{ o.gateway }} · {{ fmt(o.created_at) }}
                    </template>
                    <template #append>
                        <div class="d-flex align-center ga-2">
                            <OrderStatusChip :status="o.status" />
                            <v-btn
                                v-if="o.invoice_number"
                                size="small"
                                variant="text"
                                prepend-icon="mdi-download"
                                @click="download(o.id)"
                            >
                                Invoice
                            </v-btn>
                        </div>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>

        <AppEmptyState
            v-else-if="!isLoading"
            icon="mdi-receipt-text-outline"
            title="No orders yet"
            description="Your course and mentor-session payments will appear here."
        />
    </div>
</template>
