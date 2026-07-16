<script setup lang="ts">
const auth = useAuthStore()
const { groups } = useAppNav()

const initials = computed(() =>
    (auth.user?.name ?? '?')
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
)

async function signOut(): Promise<void> {
    await auth.logout()
    await navigateTo('/auth/login')
}
</script>

<template>
    <v-menu width="272">
        <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" aria-label="Account menu">
                <v-avatar color="primary" size="34">
                    <span class="text-body-2 font-weight-bold">{{ initials }}</span>
                </v-avatar>
            </v-btn>
        </template>

        <v-list density="compact">
            <!-- Identity -->
            <v-list-item class="py-2">
                <template #prepend>
                    <v-avatar color="primary" size="36">
                        <span class="text-body-2 font-weight-bold">{{ initials }}</span>
                    </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold">{{ auth.user?.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ auth.user?.email }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-1" />

            <!-- Grouped destinations -->
            <template v-for="group in groups" :key="group.title">
                <v-list-subheader class="text-caption font-weight-bold text-uppercase" style="letter-spacing: 0.06em">
                    {{ group.title }}
                </v-list-subheader>
                <v-list-item
                    v-for="item in group.items"
                    :key="item.to"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    density="compact"
                />
            </template>

            <v-divider class="my-1" />
            <v-list-item to="/profile" prepend-icon="mdi-account-outline" title="Profile" density="compact" />
            <v-list-item prepend-icon="mdi-logout" title="Sign out" density="compact" @click="signOut" />
        </v-list>
    </v-menu>
</template>
