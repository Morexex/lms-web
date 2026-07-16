<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { can } = useInstitutionPermissions()
const institution = useInstitutionStore()
const { data: revenue, isLoading } = useRevenue()
const { data: orders } = useInstitutionOrders()

function fmt(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''
}
</script>

<template>
    <div style="max-width: 900px">
        <AppPageHeader title="Revenue" subtitle="Orders and payouts for your institution" />

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">Select an institution to view revenue.</v-alert>
        <v-alert v-else-if="!can('members.manage')" type="warning" variant="tonal">
            You need admin access to view institution revenue.
        </v-alert>

        <template v-else>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-row v-if="revenue?.by_currency.length" class="mb-2">
                <v-col v-for="row in revenue.by_currency" :key="row.currency" cols="12" sm="6" md="4">
                    <v-card class="pa-4">
                        <div class="text-caption text-medium-emphasis">{{ row.currency }} · {{ row.count }} paid</div>
                        <div class="text-h6 font-weight-bold">{{ formatMoney(row.gross, row.currency) }}</div>
                        <v-divider class="my-2" />
                        <div class="d-flex justify-space-between text-body-2">
                            <span class="text-medium-emphasis">Platform fee</span>
                            <span>{{ formatMoney(row.platform_fee, row.currency) }}</span>
                        </div>
                        <div class="d-flex justify-space-between text-body-2 font-weight-bold">
                            <span>Your payout</span>
                            <span class="text-success">{{ formatMoney(row.net_payout, row.currency) }}</span>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <AppEmptyState
                v-else-if="!isLoading"
                icon="mdi-cash-multiple"
                title="No revenue yet"
                description="Paid course orders will show up here."
            />

            <div v-if="orders?.length" class="text-subtitle-2 font-weight-bold mt-4 mb-2">Orders</div>
            <v-card v-if="orders?.length">
                <v-table density="comfortable">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Buyer</th>
                            <th class="text-right">Amount</th>
                            <th class="text-right">Payout</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="o in orders" :key="o.id">
                            <td>{{ o.description }}</td>
                            <td>{{ o.buyer.name }}</td>
                            <td class="text-right">{{ formatMoney(o.amount, o.currency) }}</td>
                            <td class="text-right">{{ formatMoney(o.net_amount, o.currency) }}</td>
                            <td><OrderStatusChip :status="o.status" /></td>
                            <td>{{ fmt(o.created_at) }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </template>
    </div>
</template>
