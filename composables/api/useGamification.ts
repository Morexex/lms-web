import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { GamificationMe, LeaderboardRow } from '~/types/gamification'

export function useGamification() {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['gamification', 'me'],
        queryFn: async (): Promise<GamificationMe> => (await $api.get('/api/v1/gamification/me')).data.data,
    })
}

export function useLeaderboardOptIn() {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (optIn: boolean) => $api.patch('/api/v1/gamification/settings', { leaderboard_opt_in: optIn }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gamification'] })
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

export function useLeaderboard() {
    const { $api } = useNuxtApp()
    const institution = useInstitutionStore()

    return useQuery({
        queryKey: computed(() => ['leaderboard', institution.activeSlug]),
        queryFn: async (): Promise<LeaderboardRow[]> =>
            (await $api.get('/api/v1/institution/leaderboard')).data.data,
        enabled: computed(() => Boolean(institution.activeSlug)),
    })
}
