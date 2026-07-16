import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import BarChart from '~/components/BarChart.vue'

describe('BarChart', () => {
    it('renders a bar per item with labels and values', async () => {
        const wrapper = await mountSuspended(BarChart, {
            props: { items: [{ label: '0–49', value: 2 }, { label: '85–100', value: 6 }] },
        })

        expect(wrapper.text()).toContain('0–49')
        expect(wrapper.text()).toContain('85–100')
        expect(wrapper.text()).toContain('6')
    })

    it('scales bar widths relative to the maximum', async () => {
        const wrapper = await mountSuspended(BarChart, {
            props: { items: [{ label: 'a', value: 5 }, { label: 'b', value: 10 }] },
        })

        const bars = wrapper.findAll('[data-testid^="bar-"]')
        expect(bars[0]!.attributes('style')).toContain('width: 50%')
        expect(bars[1]!.attributes('style')).toContain('width: 100%')
    })

    it('shows the empty message when there is no data', async () => {
        const wrapper = await mountSuspended(BarChart, { props: { items: [], emptyText: 'Nothing here' } })

        expect(wrapper.text()).toContain('Nothing here')
    })
})
