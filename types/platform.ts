export interface PlatformSettings {
    platform_fee_percent: number
    default_gateway: string
    available_gateways: string[]
}

export interface FeatureFlag {
    key: string
    label: string
    description: string
    enabled: boolean
}

export interface AuditLogEntry {
    id: number
    action: string
    actor: { name: string; email: string } | null
    subject_type: string | null
    subject_id: number | null
    institution_id: number | null
    ip: string | null
    properties: Record<string, unknown> | null
    created_at: string | null
}

export interface AuditLogPage {
    data: AuditLogEntry[]
    meta: { current_page: number; last_page: number; total: number }
}

/** The effective feature-flag map, e.g. { mentorship: true, community: false }. */
export type FeatureMap = Record<string, boolean>
