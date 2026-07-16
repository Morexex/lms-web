import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import BadgeTile from '~/components/BadgeTile.vue'

describe('BadgeTile', () => {
    it('renders the badge label, description and earned date', async () => {
        const wrapper = await mountSuspended(BadgeTile, {
            props: {
                badge: {
                    badge: 'week_streak',
                    label: '7-Day Streak',
                    description: 'Learned seven days in a row.',
                    awarded_at: '2026-07-20T10:00:00+00:00',
                },
            },
        })

        expect(wrapper.text()).toContain('7-Day Streak')
        expect(wrapper.text()).toContain('Learned seven days in a row.')
        expect(wrapper.text()).toContain('Earned')
        expect(wrapper.find('.mdi-fire').exists()).toBe(true)
    })

    it('falls back to a generic medal icon for unknown badges', async () => {
        const wrapper = await mountSuspended(BadgeTile, {
            props: {
                badge: { badge: 'mystery', label: 'Mystery', description: 'x', awarded_at: '2026-07-20T10:00:00+00:00' },
            },
        })

        expect(wrapper.find('.mdi-medal').exists()).toBe(true)
    })
})
