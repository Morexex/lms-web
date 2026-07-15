export type LiveProvider = 'zoom' | 'meet' | 'jitsi' | 'other'

export interface LiveSession {
    id: string
    title: string
    description: string | null
    provider: LiveProvider
    join_url: string
    starts_at: string
    duration_minutes: number
    course?: { id: string; title: string }
    tutor?: { id: string; name: string }
    attendee_count?: number
}

export interface Attendee {
    id: string
    name: string
    joined_at: string
}
