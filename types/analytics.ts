export interface AnalyticsDashboard {
    enrollments: number
    completions: number
    completion_rate: number
    active_learners: number
    revenue: {
        by_currency: Array<{ currency: string; count: number; gross: number; platform_fee: number; net_payout: number }>
        paid_orders: number
        total_orders: number
    }
}

export interface CourseEngagement {
    id: string | null
    title: string | null
    enrollments: number
    completions: number
    completion_rate: number
}

export interface CourseAnalytics {
    course: { id: string; title: string }
    engagement: { enrollments: number; completions: number; completion_rate: number }
    quiz_distribution: Array<{ bucket: string; count: number }>
    drop_off: Array<{ lesson_id: number; title: string; position: number; completed: number }>
}
