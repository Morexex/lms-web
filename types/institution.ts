export interface Institution {
    id: string
    name: string
    slug: string
    status: string
    logo_path: string | null
    primary_color: string
    created_at: string | null
}

export interface Membership {
    institution: Institution
    roles: string[]
    permissions: string[]
}

export interface Member {
    id: string
    status: string
    joined_at: string | null
    user: { id: string; name: string; email: string }
}

export interface Invitation {
    id: string
    email: string
    role: string
    status: string
    expires_at: string
}
