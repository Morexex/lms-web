export function usePermissions() {
    const auth = useAuthStore()

    const can = (permission: string): boolean => auth.user?.permissions.includes(permission) ?? false
    const hasRole = (role: string): boolean => auth.user?.roles.includes(role) ?? false
    const hasAny = (permissions: string[]): boolean => permissions.some(can)

    return { can, hasRole, hasAny }
}
