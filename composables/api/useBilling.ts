import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CheckoutResponse, Order } from '~/types/billing'

export function useMyOrders() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['orders'],
        queryFn: async (): Promise<Order[]> => (await $api.get('/api/v1/orders')).data.data,
    })
}

export function useCourseCheckout(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: { gateway: string; currency: string }): Promise<CheckoutResponse> =>
            (await $api.post(`/api/v1/institution/courses/${courseId}/checkout`, payload, {
                // Idempotency-Key ensures a retried checkout returns the same order.
                headers: { 'Idempotency-Key': crypto.randomUUID() },
            })).data.data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    })
}

/** Download an order's invoice PDF through the authenticated API. */
export async function downloadInvoice(orderId: string): Promise<void> {
    const { $api } = useNuxtApp()
    const response = await $api.get(`/api/v1/orders/${orderId}/invoice`, { responseType: 'blob' })
    const url = URL.createObjectURL(response.data as Blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${orderId}.pdf`
    link.click()
    URL.revokeObjectURL(url)
}

/** Sandbox-only: simulate the gateway callback so the demo flow completes. */
export async function confirmSandboxPayment(reference: string): Promise<void> {
    const { $api } = useNuxtApp()
    await $api.post('/api/v1/billing/webhooks/sandbox', { reference, event_id: reference, status: 'paid' })
}
