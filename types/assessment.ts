export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'short_answer'

export interface QuizOption {
    id: string
    text: string
}

// --- Quiz authoring ---

export interface Question {
    id: string
    type: QuestionType
    prompt: string
    options: QuizOption[] | null
    correct: string[]
    points: number
    position: number
}

export interface Quiz {
    id: string
    title: string
    instructions: string | null
    time_limit: number | null
    attempt_limit: number | null
    passing_score: number
    is_published: boolean
    question_count?: number
    questions?: Question[]
}

// --- Quiz taking (student) ---

export interface StudentQuestion {
    id: string
    type: QuestionType
    prompt: string
    options: QuizOption[] | null
    points: number
    position: number
}

export interface QuizTakeInfo {
    id: string
    title: string
    instructions: string | null
    time_limit: number | null
    attempt_limit: number | null
    passing_score: number
    question_count: number
    attempts_used: number
    can_attempt: boolean
    in_progress_attempt_id: string | null
}

export interface AttemptStart {
    id: string
    status: string
    started_at: string | null
    max_score: number
    quiz: { id: string; title: string; instructions: string | null; time_limit: number | null }
    questions: StudentQuestion[]
}

export interface AttemptResultQuestion {
    id: string
    type: QuestionType
    prompt: string
    options: QuizOption[] | null
    correct: string[]
    your_answer: string | string[] | null
    points: number
    awarded: number
    is_correct: boolean
}

export interface AttemptResult {
    id: string
    status: string
    score: number | null
    max_score: number
    passed: boolean | null
    passing_score: number
    submitted_at: string | null
    questions: AttemptResultQuestion[]
}

export interface QuizTodo {
    id: string
    title: string
    question_count: number
    passing_score: number
    attempt_limit: number | null
    attempts_used: number
    best_score: number | null
    can_attempt: boolean
}

export type AnswerMap = Record<string, string | string[]>

// --- Assignments ---

export interface Assignment {
    id: string
    title: string
    brief: string | null
    points: number
    due_at: string | null
    is_published: boolean
    submission_count?: number
}

export interface Submission {
    id: string
    status: 'submitted' | 'graded'
    body: string | null
    media_url: string | null
    score: number | null
    feedback: string | null
    submitted_at: string | null
    graded_at: string | null
    student?: { id: string; name: string }
}

export interface AssignmentStudentView {
    id: string
    title: string
    brief: string | null
    points: number
    due_at: string | null
    submission: Submission | null
}

export interface AssignmentTodo {
    id: string
    title: string
    points: number
    due_at: string | null
    submission: { status: string; score: number | null } | null
}
