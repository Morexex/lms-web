<script setup lang="ts">
const tokens = [
    { name: 'Primary', class: 'bg-primary' },
    { name: 'Secondary', class: 'bg-secondary' },
    { name: 'Accent', class: 'bg-accent' },
    { name: 'Success', class: 'bg-success' },
    { name: 'Warning', class: 'bg-warning' },
    { name: 'Error', class: 'bg-error' },
] as const
</script>

<template>
    <div class="d-flex flex-column ga-8">
        <div>
            <h1 class="text-h4 font-weight-bold mb-2">Design System Proof Sheet</h1>
            <p class="text-body-1 text-medium-emphasis">
                Every token on one screen — headings in Plus Jakarta Sans, body in Inter,
                <code>code in JetBrains Mono</code>. Toggle the theme and everything must stay legible.
            </p>
        </div>

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
    </div>
</template>
