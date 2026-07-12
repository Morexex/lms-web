<script setup lang="ts">
const { data: memberships } = useMyInstitutions()
const institution = useInstitutionStore()

// Default to the first membership once loaded and nothing is selected.
watchEffect(() => {
    if (!institution.activeSlug && memberships.value?.length) {
        institution.setActive(memberships.value[0].institution.slug)
    }
})

const activeName = computed(
    () => memberships.value?.find((m) => m.institution.slug === institution.activeSlug)?.institution.name,
)

function choose(slug: string): void {
    institution.setActive(slug)
}
</script>

<template>
    <div v-if="memberships?.length">
        <v-menu>
            <template #activator="{ props }">
                <v-btn v-bind="props" variant="tonal" color="primary" append-icon="mdi-chevron-down" class="text-none">
                    {{ activeName ?? 'Select institution' }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="m in memberships"
                    :key="m.institution.slug"
                    :active="m.institution.slug === institution.activeSlug"
                    @click="choose(m.institution.slug)"
                >
                    <v-list-item-title>{{ m.institution.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ m.roles.join(', ') || 'member' }}</v-list-item-subtitle>
                </v-list-item>
                <v-divider />
                <v-list-item to="/institutions/create" prepend-icon="mdi-plus">
                    <v-list-item-title>New institution</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
    <v-btn v-else to="/institutions/create" variant="tonal" color="primary" prepend-icon="mdi-plus" class="text-none">
        Create institution
    </v-btn>
</template> 
