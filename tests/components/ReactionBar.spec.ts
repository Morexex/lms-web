import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ReactionBar from '~/components/ReactionBar.vue'

describe('ReactionBar', () => {
    it('renders each reaction with its count', async () => {
        const wrapper = await mountSuspended(ReactionBar, {
            props: { reactions: [{ emoji: '👍', count: 2, reacted: true }, { emoji: '🎉', count: 1, reacted: false }] },
        })

        expect(wrapper.text()).toContain('👍 2')
        expect(wrapper.text()).toContain('🎉 1')
    })

    it('emits toggle with the emoji when a reaction is clicked', async () => {
        const wrapper = await mountSuspended(ReactionBar, {
            props: { reactions: [{ emoji: '👍', count: 2, reacted: true }] },
        })

        await wrapper.find('.v-chip').trigger('click')

        expect(wrapper.emitted('toggle')?.at(-1)).toEqual(['👍'])
    })
})
