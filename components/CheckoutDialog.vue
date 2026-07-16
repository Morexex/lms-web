<script setup lang="ts">
import type { CoursePriceOption } from '~/types/billing'

const props = defineProps<{ courseId: string; title: string; prices: CoursePriceOption[] }>()
const emit = defineEmits<{ close: [] }>()

const checkout = useCourseCheckout(props.courseId)
const { message, handle, reset } = useApiErrors()

const gateways = [
    { title: 'Sandbox (test)', value: 'sandbox' },
    { title: 'Card — Stripe', value: 'stripe' },
    { title: 'M-Pesa', value: 'mpesa' },
    { title: 'Paystack', value: 'paystack' },
]

const currencies = computed(() => props.prices.map((p) => p.currency))
const gateway = ref('sandbox')
const currency = ref(props.prices[0]?.currency ?? '')
const instructions = ref('')

const selectedPrice = computed(() => props.prices.find((p) => p.currency === currency.value) ?? null)

async function pay(): Promise<void> {
    reset()
    instructions.value = ''
    try {
        const result = await checkout.mutateAsync({ gateway: gateway.value, currency: currency.value })
        if (result.redirect_url) {
            await navigateTo(result.redirect_url, { external: true })
            return
        }
        // M-Pesa (and similar) return instructions instead of a redirect.
        instructions.value = result.instructions ?? 'Payment started. Track it under Orders.'
    } catch (error) {
        handle(error)
    }
}
</script>

<template>
    <v-dialog :model-value="true" max-width="440" @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <span>Checkout</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <p class="text-body-2 text-medium-emphasis mb-3">{{ title }}</p>
                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>

                <template v-if="instructions">
                    <v-alert type="info" variant="tonal" class="mb-3">{{ instructions }}</v-alert>
                    <v-btn block color="primary" variant="tonal" to="/orders">View my orders</v-btn>
                </template>

                <template v-else>
                    <v-select v-model="currency" :items="currencies" label="Currency" density="compact" class="mb-2" hide-details />
                    <v-select v-model="gateway" :items="gateways" label="Payment method" density="compact" class="mb-3" hide-details />
                    <div v-if="selectedPrice" class="text-h6 font-weight-bold text-primary mb-3">
                        {{ formatMoney(selectedPrice.amount, selectedPrice.currency) }}
                    </div>
                    <v-btn block color="primary" size="large" :loading="checkout.isPending.value" :disabled="!currency" @click="pay">
                        Pay now
                    </v-btn>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
