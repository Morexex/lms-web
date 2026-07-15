import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import NotificationItem from '~/components/NotificationItem.vue'
import type { AppNotification } from '~/types/messaging'

function make(overrides: Partial<AppNotification> = {}): AppNotification {
    return {
        id: 'n1',
        category: 'new_message',
        title: 'New message',
        body: 'You have a message from Ada.',
        payload: {},
        action_url: null,
        read_at: null,
        created_at: '2026-07-17T10:00:00+00:00',
        ...overrides,
    }
}

describe('NotificationItem', () => {
    it('renders the title and body', async () => {
        const wrapper = await mountSuspended(NotificationItem, { props: { notification: make() } })

        expect(wrapper.text()).toContain('New message')
        expect(wrapper.text()).toContain('You have a message from Ada.')
    })

    it('shows an unread dot only when unread', async () => {
        const unread = await mountSuspended(NotificationItem, { props: { notification: make({ read_at: null }) } })
        expect(unread.find('.mdi-circle').exists()).toBe(true)

        const read = await mountSuspended(NotificationItem, {
            props: { notification: make({ read_at: '2026-07-17T11:00:00+00:00' }) },
        })
        expect(read.find('.mdi-circle').exists()).toBe(false)
    })
})
