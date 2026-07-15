export interface ReactionSummary {
    emoji: string
    count: number
    reacted: boolean
}

export interface Author {
    id: string
    name: string
}

export interface Reply {
    id: string
    body: string
    is_hidden: boolean
    author?: Author
    reactions?: ReactionSummary[]
    created_at: string | null
}

export interface Thread {
    id: string
    title: string
    body: string
    is_pinned: boolean
    is_locked: boolean
    is_hidden: boolean
    reply_count?: number
    author?: Author
    replies?: Reply[]
    reactions?: ReactionSummary[]
    last_activity_at: string | null
    created_at: string | null
}
