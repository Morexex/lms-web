import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import AppEmptyState from '~/components/ui/AppEmptyState.vue'

describe('AppEmptyState', () => {
    it('renders title and description', async () => {
        const wrapper = await mountSuspended(AppEmptyState, {
            props: { title: 'No courses yet', description: 'Enroll to get started.' },
        })

        expect(wrapper.text()).toContain('No courses yet')
        expect(wrapper.text()).toContain('Enroll to get started.')
    })
})
