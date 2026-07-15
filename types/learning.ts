export interface ContentBlock {
    id: string
    type: string
    position: number
    content: Record<string, unknown> | null
    media_url?: string | null
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

export interface LearnLesson {
    id: string
    title: string
    is_preview: boolean
    completed: boolean
}

export interface LearnSection {
    id: string
    title: string
    lessons: LearnLesson[]
}

export interface Curriculum {
    enrolled: boolean
    completed: boolean
    progress: { percent: number; completed: number; total: number }
    course: { id: string; title: string; summary: string | null }
    sections: LearnSection[]
}

export interface Enrollment {
    id: string
    status: string
    progress: number
    enrolled_at: string | null
    completed_at: string | null
    course: { id: string; title: string; slug: string; summary: string | null; level: string }
}
