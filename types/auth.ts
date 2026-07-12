import { z } from 'zod'

export interface AuthUser {
    id: string
    name: string
    email: string
    timezone: string
    email_verified: boolean
    roles: string[]
    permissions: string[]
}

export interface SessionPayload {
    user: AuthUser
    access_token: string
    token_type: string
    expires_in: number
}

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
    .object({
        name: z.string().min(2, 'Please enter your name'),
        email: z.string().min(1, 'Email is required').email('Enter a valid email'),
        password: z.string().min(8, 'At least 8 characters'),
        password_confirmation: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    })

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
})

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, 'At least 8 characters'),
        password_confirmation: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    })
