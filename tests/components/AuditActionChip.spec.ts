import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AuditActionChip from '~/components/AuditActionChip.vue'

describe('AuditActionChip', () => {
    it('renders the full action string', async () => {
        const wrapper = await mountSuspended(AuditActionChip, { props: { action: 'payment.refunded' } })
        expect(wrapper.text()).toContain('payment.refunded')
    })

    it('colours by the action category prefix', async () => {
        const payment = await mountSuspended(AuditActionChip, { props: { action: 'payment.refunded' } })
        expect(payment.html()).toContain('text-success')

        const platform = await mountSuspended(AuditActionChip, { props: { action: 'platform.settings.updated' } })
        expect(platform.html()).toContain('text-warning')
    })

    it('falls back to the default colour for unknown categories', async () => {
        const wrapper = await mountSuspended(AuditActionChip, { props: { action: 'something.weird' } })
        expect(wrapper.html()).not.toContain('text-success')
        expect(wrapper.html()).not.toContain('text-warning')
    })
})
