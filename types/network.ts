export interface NetworkSkill {
    id: string
    name: string
    endorsement_count: number
    endorsed: boolean
}

export interface EarnedCertificate {
    course_title: string
    institution_name: string
    issued_at: string
    code: string
}

export interface NetworkProfile {
    id: string
    user: { id: string; name: string }
    headline: string
    bio: string | null
    is_public: boolean
    skills: NetworkSkill[]
    certificates: EarnedCertificate[]
}

export interface ConnectionUser {
    id: string
    status: string
    user: { id: string; name: string }
}

export interface PendingRequest {
    id: string
    user: { id: string; name: string }
}

export interface Milestone {
    id: string
    type: string
    title: string
    occurred_at: string
    user: { id: string; name: string }
}
