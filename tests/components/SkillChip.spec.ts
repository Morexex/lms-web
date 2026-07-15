import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SkillChip from '~/components/SkillChip.vue'

describe('SkillChip', () => {
    it('shows the name and endorsement count', async () => {
        const wrapper = await mountSuspended(SkillChip, {
            props: { skill: { id: 's1', name: 'PHP', endorsement_count: 3, endorsed: true } },
        })

        expect(wrapper.text()).toContain('PHP')
        expect(wrapper.text()).toContain('· 3')
    })

    it('emits endorse when clicked and endorsing is allowed', async () => {
        const wrapper = await mountSuspended(SkillChip, {
            props: { skill: { id: 's1', name: 'PHP', endorsement_count: 0, endorsed: false }, canEndorse: true },
        })

        await wrapper.find('.v-chip').trigger('click')

        expect(wrapper.emitted('endorse')).toHaveLength(1)
    })
})
