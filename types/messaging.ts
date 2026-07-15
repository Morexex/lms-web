export interface AppNotification {
    id: string
    category: string | null
    title: string | null
    body: string | null
    payload: Record<string, unknown>
    action_url: string | null
    read_at: string | null
    created_at: string | null
}

export interface NotificationPreference {
    category: string
    label: string
    description: string
    in_app: boolean
    email: boolean
}

export interface ConversationSummary {
    id: string
    other_participant: { id: string; name: string } | null
    last_message: { body: string; at: string | null; mine: boolean } | null
    unread_count: number
    last_message_at: string | null
}

export interface Message {
    id: string
    body: string
    mine: boolean
    sender?: { id: string; name: string }
    created_at: string | null
}

export interface Announcement {
    id: string
    scope: 'institution' | 'course'
    title: string
    body: string
    author?: { id: string; name: string }
    created_at: string | null
}
