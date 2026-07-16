import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import OrderStatusChip from '~/components/OrderStatusChip.vue'

describe('OrderStatusChip', () => {
    it('labels a known status', async () => {
        const wrapper = await mountSuspended(OrderStatusChip, { props: { status: 'paid' } })
        expect(wrapper.text()).toContain('Paid')
    })

    it('falls back to the raw status when unknown', async () => {
        const wrapper = await mountSuspended(OrderStatusChip, { props: { status: 'weird' } })
        expect(wrapper.text()).toContain('weird')
    })
})
