import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppStatCard from '~/components/ui/AppStatCard.vue'

describe('AppStatCard', () => {
    it('renders label and value', async () => {
        const wrapper = await mountSuspended(AppStatCard, {
            props: { label: 'Courses', value: 128, icon: 'mdi-book-open-variant' },
        })

        expect(wrapper.text()).toContain('Courses')
        expect(wrapper.text()).toContain('128')
    })
})
