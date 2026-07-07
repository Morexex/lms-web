<script setup lang="ts">
const tokens = [
    { name: 'Primary', class: 'bg-primary' },
    { name: 'Secondary', class: 'bg-secondary' },
    { name: 'Accent', class: 'bg-accent' },
    { name: 'Success', class: 'bg-success' },
    { name: 'Warning', class: 'bg-warning' },
    { name: 'Error', class: 'bg-error' },
] as const

const { data: platform, isPending, isError, refetch } = usePlatformStatus()

const demoStats = [
    { label: 'Courses', value: 128, icon: 'mdi-book-open-variant' },
    { label: 'Learners', value: '4,821', icon: 'mdi-account-group', color: 'secondary' },
    { label: 'Certificates', value: 963, icon: 'mdi-certificate', color: 'accent' },
] as const
</script>

<template>
    <div class="d-flex flex-column ga-8">
        <AppPageHeader
            title="Design System Proof Sheet"
            subtitle="Every token, primitive, and the API bridge on one screen."
        />

        <v-card class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-4">Palette</h2>
            <div class="d-flex flex-wrap ga-4">
                <div v-for="token in tokens" :key="token.name" class="text-center">
                    <v-sheet :class="token.class" width="96" height="64" rounded="lg" />
                    <span class="text-caption">{{ token.name }}</span>
                </div>
            </div>
        </v-card>

        <v-card class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-4">Controls</h2>
            <div class="d-flex flex-wrap align-center ga-4 mb-6">
                <v-btn color="primary">Enroll now</v-btn>
                <v-btn color="secondary" variant="tonal">Preview course</v-btn>
                <v-btn color="accent" variant="flat" prepend-icon="mdi-certificate">Certificate</v-btn>
                <v-btn variant="outlined" color="primary">Outlined</v-btn>
                <v-btn variant="text">Text</v-btn>
            </div>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field label="Email address" placeholder="amina@example.com" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-select label="Role" :items="['Student', 'Tutor', 'Mentor']" />
                </v-col>
            </v-row>
        </v-card>

        <v-card class="pa-6">
            <h2 class="text-h6 font-weight-bold mb-4">API Bridge</h2>

            <div v-if="isPending" class="d-flex align-center ga-3">
                <v-progress-circular indeterminate size="20" color="primary" />
                <span class="text-body-2">Contacting lms-api…</span>
            </div>

            <v-alert v-else-if="isError" type="error" variant="tonal" rounded="lg">
                Could not reach the API.
                <template #append>
                    <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn>
                </template>
            </v-alert>

            <div v-else-if="platform" class="d-flex align-center ga-3">
                <v-chip color="success" variant="tonal" prepend-icon="mdi-check-circle">
                    {{ platform.status }}
                </v-chip>
                <code>{{ platform.service }} · {{ platform.version }}</code>
                <span class="text-caption text-medium-emphasis">live from lms-api.test</span>
            </div>
        </v-card>

        <v-row>
            <v-col v-for="stat in demoStats" :key="stat.label" cols="12" sm="4">
                <AppStatCard v-bind="stat" />
            </v-col>
        </v-row>

        <v-card>
            <AppEmptyState
                icon="mdi-school-outline"
                title="No courses yet"
                description="This is the AppEmptyState primitive — every empty screen in LUMEN will use it."
            >
                <template #action>
                    <v-btn color="primary">Browse catalog</v-btn>
                </template>
            </AppEmptyState>
        </v-card>
    </div>
</template>
