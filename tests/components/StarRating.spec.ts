import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import StarRating from '~/components/StarRating.vue'

describe('StarRating', () => {
    it('renders filled stars up to the value', async () => {
        const wrapper = await mountSuspended(StarRating, { props: { value: 3, max: 5 } })

        expect(wrapper.findAll('.mdi-star')).toHaveLength(3)
        expect(wrapper.findAll('.mdi-star-outline')).toHaveLength(2)
    })

    it('emits the chosen star count when editable', async () => {
        const wrapper = await mountSuspended(StarRating, { props: { value: 0, editable: true } })

        // Click the 4th star icon.
        await wrapper.findAll('.v-icon')[3]!.trigger('click')

        expect(wrapper.emitted('update:value')?.at(-1)).toEqual([4])
    })

    it('does not emit when not editable', async () => {
        const wrapper = await mountSuspended(StarRating, { props: { value: 2 } })

        await wrapper.findAll('.v-icon')[0]!.trigger('click')

        expect(wrapper.emitted('update:value')).toBeUndefined()
    })
})
