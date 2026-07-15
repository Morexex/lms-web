import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { Assignment, AssignmentStudentView, AssignmentTodo, Submission } from '~/types/assessment'

// --- Authoring + grading (tutor) ---

export function useAssignments(courseId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'assignments'],
        queryFn: async (): Promise<Assignment[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/assignments`)).data.data,
    })
}

export function useAssignmentActions(courseId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()
    const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['course', courseId, 'assignments'] })

    return {
        create: useMutation({
            mutationFn: (data: Partial<Assignment>) =>
                $api.post(`/api/v1/institution/courses/${courseId}/assignments`, data),
            onSuccess,
        }),
        update: useMutation({
            mutationFn: (p: { id: string; data: Partial<Assignment> }) =>
                $api.patch(`/api/v1/institution/assignments/${p.id}`, p.data),
            onSuccess,
        }),
        remove: useMutation({
            mutationFn: (id: string) => $api.delete(`/api/v1/institution/assignments/${id}`),
            onSuccess,
        }),
    }
}

export function useSubmissions(assignmentId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['assignment', assignmentId, 'submissions'],
        queryFn: async (): Promise<Submission[]> =>
            (await $api.get(`/api/v1/institution/assignments/${assignmentId}/submissions`)).data.data,
    })
}

export function useGradeSubmission(assignmentId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (p: { id: string; score: number; feedback: string | null }) =>
            $api.patch(`/api/v1/institution/submissions/${p.id}/grade`, { score: p.score, feedback: p.feedback }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId, 'submissions'] }),
    })
}

// --- Student ---

export function useAssignmentsTodo(courseId: string, enabled?: Ref<boolean>) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['course', courseId, 'assignments-todo'],
        queryFn: async (): Promise<AssignmentTodo[]> =>
            (await $api.get(`/api/v1/institution/courses/${courseId}/assignments/todo`)).data.data,
        enabled: enabled ?? true,
    })
}

export function useAssignmentView(assignmentId: string) {
    const { $api } = useNuxtApp()

    return useQuery({
        queryKey: ['assignment', assignmentId, 'view'],
        queryFn: async (): Promise<AssignmentStudentView> =>
            (await $api.get(`/api/v1/institution/assignments/${assignmentId}/submission`)).data.data,
        retry: false,
    })
}

export function useSubmitAssignment(assignmentId: string) {
    const { $api } = useNuxtApp()
    const queryClient = useQueryClient()

    return useMutation({
        // Multipart so an optional file rides along; axios sets the boundary.
        mutationFn: async (p: { body: string; file: File | null }): Promise<Submission> => {
            const form = new FormData()
            form.append('body', p.body)
            if (p.file) form.append('file', p.file)
            return (await $api.post(`/api/v1/institution/assignments/${assignmentId}/submissions`, form)).data.data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId, 'view'] }),
    })
}
