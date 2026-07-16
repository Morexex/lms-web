<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const reference = computed(() => (typeof route.query.reference === 'string' ? route.query.reference : null))

const { data: orders, isLoading, refetch } = useMyOrders()
const { message, handle, reset } = useApiErrors()
const confirming = ref(false)

const order = computed(() => (orders.value ?? []).find((o) => o.gateway_reference === reference.value) ?? null)
const isPaid = computed(() => order.value?.status === 'paid')

async function completeSandbox(): Promise<void> {
    if (!reference.value) return
    reset()
    confirming.value = true
    try {
        await confirmSandboxPayment(reference.value)
        await refetch()
    } catch (error) {
        handle(error)
    } finally {
        confirming.value = false
    }
}
</script>

<template>
    <div style="max-width: 560px" class="text-center">
        <v-progress-circular v-if="isLoading" indeterminate color="primary" class="my-8" />

        <template v-else-if="isPaid">
            <v-icon icon="mdi-check-decagram" color="success" size="64" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-2">Payment complete</h1>
            <p class="text-body-1 text-medium-emphasis mb-4">{{ order?.description }}</p>
            <v-btn color="primary" to="/orders">View my orders</v-btn>
        </template>

        <template v-else-if="order">
            <v-icon icon="mdi-timer-sand" color="info" size="56" class="mb-3" />
            <h1 class="text-h6 font-weight-bold mb-1">Awaiting payment</h1>
            <p class="text-body-2 text-medium-emphasis mb-4">
                {{ order.description }} — <OrderStatusChip :status="order.status" />
            </p>
            <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>
            <div class="d-flex justify-center ga-2">
                <v-btn variant="tonal" @click="refetch()">Refresh</v-btn>
                <v-btn v-if="order.gateway === 'sandbox'" color="primary" :loading="confirming" @click="completeSandbox">
                    Complete sandbox payment
                </v-btn>
            </div>
        </template>

        <template v-else>
            <v-icon icon="mdi-help-circle-outline" color="medium-emphasis" size="56" class="mb-3" />
            <p class="text-body-1 text-medium-emphasis">We couldn't find that payment. Check your <NuxtLink to="/orders">orders</NuxtLink>.</p>
        </template>
    </div>
</template>
