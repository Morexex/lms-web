export function useInstitutionPermissions() {
    const { data } = useMyInstitutions()
    const institution = useInstitutionStore()

    const active = computed(() => data.value?.find((m) => m.institution.slug === institution.activeSlug) ?? null)
    const can = (permission: string): boolean => active.value?.permissions.includes(permission) ?? false
    const hasRole = (role: string): boolean => active.value?.roles.includes(role) ?? false

    return { active, can, hasRole }
}
