export interface AppNavItem {
    title: string
    icon: string
    to: string
}

export interface AppNavGroup {
    title: string
    items: AppNavItem[]
}

/**
 * The single source of truth for app navigation. Items are grouped by intent
 * and gated by feature flags, institution permissions, and platform role —
 * users only see destinations that are theirs to visit.
 */
export function useAppNav() {
    const { isEnabled } = useFeatures()
    const { can } = useInstitutionPermissions()
    const auth = useAuthStore()

    /** Always-visible destinations, shown in the top bar on desktop. */
    const primary = computed<AppNavItem[]>(() => [
        { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
        { title: 'Catalog', icon: 'mdi-book-open-variant', to: '/catalog' },
        { title: 'My learning', icon: 'mdi-play-circle-outline', to: '/learning' },
        { title: 'Messages', icon: 'mdi-message-text-outline', to: '/messages' },
        { title: 'Network', icon: 'mdi-account-group-outline', to: '/network' },
    ])

    /** Grouped secondary destinations for the user menu and mobile drawer. */
    const groups = computed<AppNavGroup[]>(() => {
        const learning: AppNavItem[] = [
            ...(isEnabled('mentorship')
                ? [
                        { title: 'Find a mentor', icon: 'mdi-account-tie-outline', to: '/mentors' },
                        { title: 'My sessions', icon: 'mdi-calendar-account-outline', to: '/mentorship/sessions' },
                    ]
                : []),
            ...(isEnabled('gamification')
                ? [{ title: 'Achievements', icon: 'mdi-medal-outline', to: '/achievements' }]
                : []),
            { title: 'Certificates', icon: 'mdi-certificate-outline', to: '/certificates' },
            { title: 'Announcements', icon: 'mdi-bullhorn-outline', to: '/announcements' },
            { title: 'My orders', icon: 'mdi-receipt-text-outline', to: '/orders' },
        ]

        const teaching: AppNavItem[] = [
            ...(can('courses.update')
                ? [
                        { title: 'Manage courses', icon: 'mdi-bookshelf', to: '/courses' },
                        { title: 'Analytics', icon: 'mdi-chart-box-outline', to: '/analytics' },
                    ]
                : []),
            ...(can('members.manage')
                ? [
                        { title: 'People', icon: 'mdi-account-multiple-outline', to: '/people' },
                        { title: 'Revenue', icon: 'mdi-cash-multiple', to: '/revenue' },
                        { title: 'Website', icon: 'mdi-web', to: '/manage/cms' },
                    ]
                : []),
        ]

        const platform: AppNavItem[] = auth.isPlatformAdmin
            ? [
                    { title: 'Users', icon: 'mdi-shield-account-outline', to: '/platform/users' },
                    { title: 'Platform', icon: 'mdi-cog-outline', to: '/platform/settings' },
                ]
            : []

        return [
            { title: 'Learning', items: learning },
            { title: 'Teach & manage', items: teaching },
            { title: 'Platform', items: platform },
        ].filter((group) => group.items.length > 0)
    })

    return { primary, groups }
}
