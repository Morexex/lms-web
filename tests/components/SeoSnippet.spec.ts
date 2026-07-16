import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SeoSnippet from '~/components/SeoSnippet.vue'

describe('SeoSnippet', () => {
    it('renders title, url and description', async () => {
        const wrapper = await mountSuspended(SeoSnippet, {
            props: { title: 'About | Acme', url: 'lumen.app/site/acme/about', description: 'Who we are.' },
        })

        expect(wrapper.text()).toContain('About | Acme')
        expect(wrapper.text()).toContain('lumen.app/site/acme/about')
        expect(wrapper.text()).toContain('Who we are.')
    })

    it('shows a hint when the description is missing', async () => {
        const wrapper = await mountSuspended(SeoSnippet, {
            props: { title: 'About', url: 'lumen.app/x', description: null },
        })

        expect(wrapper.text()).toContain('Add an SEO description')
    })
})
