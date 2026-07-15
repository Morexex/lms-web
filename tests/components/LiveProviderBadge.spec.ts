import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import LiveProviderBadge from '~/components/LiveProviderBadge.vue'

describe('LiveProviderBadge', () => {
    it('labels a known provider', async () => {
        const wrapper = await mountSuspended(LiveProviderBadge, { props: { provider: 'jitsi' } })
        expect(wrapper.text()).toContain('Jitsi')
    })

    it('renders each provider distinctly', async () => {
        const zoom = await mountSuspended(LiveProviderBadge, { props: { provider: 'zoom' } })
        const meet = await mountSuspended(LiveProviderBadge, { props: { provider: 'meet' } })
        expect(zoom.text()).toContain('Zoom')
        expect(meet.text()).toContain('Google Meet')
    })
})
