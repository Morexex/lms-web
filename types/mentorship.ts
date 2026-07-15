export interface MentorService {
    id: string
    title: string
    description: string | null
    duration_minutes: number
    is_free: boolean
    price_amount: number | null
    price_currency: string | null
    is_active: boolean
}

export interface AvailabilityRule {
    id: number
    day_of_week: number
    start_time: string
    end_time: string
}

export interface MentorProfile {
    id: string
    headline: string
    bio: string | null
    timezone: string
    is_published: boolean
    mentor?: { id: string; name: string }
    services?: MentorService[]
    availability?: AvailabilityRule[]
}

export interface Slot {
    starts_at: string
    ends_at: string
    starts_at_local: string
}

export interface Booking {
    id: string
    status: 'confirmed' | 'completed' | 'cancelled'
    starts_at: string
    ends_at: string
    mentee_timezone: string
    mentor_profile_id?: string
    price_amount: number | null
    price_currency: string | null
    service?: { id: string; title: string; duration_minutes: number }
    mentor?: { id: string; name: string }
    mentee?: { id: string; name: string }
    rating?: { stars: number; comment: string | null } | null
}
