export interface EarnedBadge {
    badge: string
    label: string
    description: string
    awarded_at: string
}

export interface GamificationMe {
    total_points: number
    streak_days: number
    badges: EarnedBadge[]
    leaderboard_opt_in: boolean
}

export interface LeaderboardRow {
    rank: number
    user: { id: string | null; name: string | null }
    points: number
    is_me: boolean
}
