export interface Certificate {
    id: string
    course_title: string
    learner_name: string
    verification_code: string
    issued_at: string
    download_url: string | null
}

export interface VerificationResult {
    valid: boolean
    learner_name?: string
    course_title?: string
    institution_name?: string
    issued_at?: string
}
