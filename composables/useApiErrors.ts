import type { AxiosError } from 'axios'

interface ApiErrorBody {
    message?: string
    code?: string
    errors?: Record<string, string[]>
}

export function useApiErrors() {
    const message = ref('')

    function handle(error: unknown, setErrors?: (fields: Record<string, string>) => void): void {
        const body = (error as AxiosError<ApiErrorBody>)?.response?.data
        message.value = body?.message ?? 'Something went wrong. Please try again.'

        if (body?.errors && setErrors) {
            const mapped = Object.fromEntries(
                Object.entries(body.errors).map(([field, msgs]) => [field, msgs[0] ?? '']),
            )
            setErrors(mapped)
        }
    }

    function reset(): void {
        message.value = ''
    }

    return { message, handle, reset }
}
