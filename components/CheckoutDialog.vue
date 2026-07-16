<script setup lang="ts">
import type { CoursePriceOption } from '~/types/billing'

const props = defineProps<{ courseId: string; title: string; prices: CoursePriceOption[] }>()
const emit = defineEmits<{ close: [] }>()

const checkout = useCourseCheckout(props.courseId)
const { message, handle, reset } = useApiErrors()

const gateways = [
    { title: 'Sandbox (test)', value: 'sandbox', icon: 'mdi-test-tube', hint: 'Instant test payment' },
    { title: 'Card', value: 'stripe', icon: 'mdi-credit-card-outline', hint: 'Visa, Mastercard via Stripe' },
    { title: 'M-Pesa', value: 'mpesa', icon: 'mdi-cellphone', hint: 'STK push to your phone' },
    { title: 'Paystack', value: 'paystack', icon: 'mdi-bank-outline', hint: 'Cards, bank & mobile money' },
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
    <v-dialog :model-value="true" max-width="460" @update:model-value="emit('close')">
        <v-card>
            <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-lock" size="small" color="primary" class="mr-2" />
                <span>Secure checkout</span>
                <v-spacer />
                <v-btn icon="mdi-close" variant="text" aria-label="Close" @click="emit('close')" />
            </v-card-title>
            <v-card-text>
                <!-- Order summary -->
                <v-card variant="tonal" color="primary" class="pa-4 mb-4">
                    <div class="d-flex align-center justify-space-between ga-3">
                        <div>
                            <div class="text-caption" style="opacity: 0.8">You're buying</div>
                            <div class="text-body-1 font-weight-bold">{{ title }}</div>
                        </div>
                        <div v-if="selectedPrice" class="text-h6 font-weight-bold text-no-wrap">
                            {{ formatMoney(selectedPrice.amount, selectedPrice.currency) }}
                        </div>
                    </div>
                </v-card>

                <v-alert v-if="message" type="error" variant="tonal" density="compact" class="mb-3">{{ message }}</v-alert>

                <template v-if="instructions">
                    <v-alert type="info" variant="tonal" class="mb-3">{{ instructions }}</v-alert>
                    <v-btn block color="primary" variant="tonal" to="/orders">View my orders</v-btn>
                </template>

                <template v-else>
                    <v-select
                        v-if="currencies.length > 1"
                        v-model="currency"
                        :items="currencies"
                        label="Currency"
                        density="comfortable"
                        prepend-inner-icon="mdi-currency-usd"
                        class="mb-3"
                        hide-details
                    />

                    <!-- Payment methods as tactile options, not a dropdown -->
                    <p class="text-caption font-weight-bold text-medium-emphasis mb-2">PAY WITH</p>
                    <v-item-group v-model="gateway" mandatory class="d-flex flex-column ga-2 mb-4">
                        <v-item v-for="g in gateways" :key="g.value" v-slot="{ isSelected, toggle }" :value="g.value">
                            <v-card
                                :variant="isSelected ? 'tonal' : 'outlined'"
                                :color="isSelected ? 'primary' : undefined"
                                class="pa-3 d-flex align-center ga-3"
                                @click="toggle"
                            >
                                <v-icon :icon="g.icon" />
                                <div class="flex-grow-1">
                                    <div class="text-body-2 font-weight-bold">{{ g.title }}</div>
                                    <div class="text-caption text-medium-emphasis">{{ g.hint }}</div>
                                </div>
                                <v-icon v-if="isSelected" icon="mdi-check-circle" color="primary" />
                            </v-card>
                        </v-item>
                    </v-item-group>

                    <v-btn
                        block
                        color="primary"
                        size="large"
                        class="font-weight-bold"
                        :loading="checkout.isPending.value"
                        :disabled="!currency"
                        @click="pay"
                    >
                        Pay {{ selectedPrice ? formatMoney(selectedPrice.amount, selectedPrice.currency) : 'now' }}
                    </v-btn>
                    <p class="text-caption text-medium-emphasis text-center mt-3 mb-0">
                        <v-icon icon="mdi-shield-check-outline" size="14" /> Payments are verified before your course unlocks.
                    </p>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
