import type { Course } from '~/types/catalog'

/** Present a course price from integer minor units + currency. */
export function formatPrice(course: Pick<Course, 'is_free' | 'price_amount' | 'price_currency'>): string {
    if (course.is_free) {
        return 'Free'
    }
    if (course.price_amount === null) {
        return '—'
    }
    return `${course.price_currency} ${(course.price_amount / 100).toFixed(2)}`
}

export function courseLevelLabel(level: string): string {
    return level === 'all_levels' ? 'All levels' : level.charAt(0).toUpperCase() + level.slice(1)
}
