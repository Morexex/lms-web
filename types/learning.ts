export interface ContentBlock {
    id: string
    type: string
    position: number
    content: Record<string, unknown> | null
}

export interface Lesson {
    id: string
    title: string
    position: number
    is_preview: boolean
    blocks?: ContentBlock[]
}

export interface Section {
    id: string
    title: string
    position: number
    lessons: Lesson[]
}

export interface Curriculum {
    enrolled: boolean
    course: { id: string; title: string; summary: string | null }
    sections: Section[]
}

export interface Enrollment {
    id: string
    status: string
    enrolled_at: string | null
    course: { id: string; title: string; slug: string; summary: string | null; level: string }
}
