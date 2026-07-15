import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type {
    AnswerMap,
    AttemptResult,
    AttemptStart,
    Question,
    Quiz,
    QuizTakeInfo,
    QuizTodo,
} from '~/types/assessment'

// --- Authoring ---

export function useQuizzes(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'quizzes'],
        queryFn: async (): Promise<Quiz[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/quizzes`)).data.data,
    })
}

export function useQuiz(quizId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['quiz', quizId.value]),
        queryFn: async (): Promise<Quiz> => (await $api.get(`/api/v1/institution/quizzes/${quizId.value}`)).data.data,
        enabled: computed(() => Boolean(quizId.value)),
    })
}

export function useQuizActions(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const invalidateList = () => queryClient.invalidateQueries({ queryKey: ['course', courseId, 'quizzes'] })

    return {
        createQuiz: useMutation({
            mutationFn: async (data: Partial<Quiz>): Promise<Quiz> =>
                (await $api.post(`/api/v1/institution/courses/${courseId}/quizzes`, data)).data.data,
            onSuccess: invalidateList,
        }),
        updateQuiz: useMutation({
            mutationFn: (p: { id: string; data: Partial<Quiz> }) => $api.patch(`/api/v1/institution/quizzes/${p.id}`, p.data),
            onSuccess: (_r, p) => {
                invalidateList()
                queryClient.invalidateQueries({ queryKey: ['quiz', p.id] })
            },
        }),
        deleteQuiz: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/quizzes/${id}`),
            onSuccess: invalidateList,
        }),
    }
}

export function useQuestionActions(quizId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })

    return {
        create: useMutation({
            mutationFn: (data: Partial<Question>) => $api.post(`/api/v1/institution/quizzes/${quizId}/questions`, data),
            onSuccess,
        }),
        update: useMutation({
            mutationFn: (p: { id: string; data: Partial<Question> }) =>
                $api.patch(`/api/v1/institution/questions/${p.id}`, p.data),
            onSuccess,
        }),
        remove: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/questions/${id}`),
            onSuccess,
        }),
        reorder: useMutation({
            mutationFn: (ids: string[]) => $api.post(`/api/v1/institution/quizzes/${quizId}/questions/reorder`, { ids }),
            onSuccess,
        }),
    }
}

// --- Taking (student) ---

export function useQuizzesTodo(courseId: string, enabled?: Ref<boolean>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'quizzes-todo'],
        queryFn: async (): Promise<QuizTodo[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/quizzes/todo`)).data.data,
        enabled: enabled ?? true,
    })
}

export function useQuizTake(quizId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['quiz-take', quizId],
        queryFn: async (): Promise<QuizTakeInfo> =>
            (await $api.get(`/api/v1/institution/quizzes/${quizId}/take`)).data.data,
        retry: false,
    })
}

export function useAttempt(attemptId: Ref<string | null>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: computed(() => ['attempt', attemptId.value]),
        queryFn: async (): Promise<AttemptResult> =>
            (await $api.get(`/api/v1/institution/attempts/${attemptId.value}`)).data.data,
        enabled: computed(() => Boolean(attemptId.value)),
    })
}

export function useAttemptActions() {
    const { $api } = useNuxtApp()

    return {
        start: useMutation({
            mutationFn: async (quizId: string): Promise<AttemptStart> =>
                (await $api.post(`/api/v1/institution/quizzes/${quizId}/attempts`)).data.data,
        }),
        submit: useMutation({
            mutationFn: async (p: { attemptId: string; answers: AnswerMap }): Promise<AttemptResult> =>
                (await $api.post(`/api/v1/institution/attempts/${p.attemptId}/submit`, { answers: p.answers })).data.data,
        }),
    }
}
