<script setup lang="ts">
// Public page — deliberately no auth middleware.
definePageMeta({ layout: 'auth' })

const code = useRoute().params.code as string
const { data: result, isLoading } = useVerifyCertificate(code)
</script>

<template>
    <v-card class="pa-6 pa-sm-8 text-center">
        <template v-if="isLoading">
            <v-progress-circular indeterminate color="primary" />
        </template>

        <template v-else-if="result?.valid">
            <v-icon icon="mdi-check-decagram" color="success" size="64" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-1">Certificate verified</h1>
            <p class="text-body-2 text-medium-emphasis mb-6">This is a genuine LUMEN credential.</p>

            <v-card variant="tonal" class="pa-4 text-left">
                <div class="text-caption text-medium-emphasis">Awarded to</div>
                <div class="text-body-1 font-weight-bold mb-2">{{ result.learner_name }}</div>
                <div class="text-caption text-medium-emphasis">For completing</div>
                <div class="text-body-1 font-weight-bold mb-2">{{ result.course_title }}</div>
                <div class="text-caption text-medium-emphasis">Issued by</div>
                <div class="text-body-2 mb-2">{{ result.institution_name }}</div>
                <div class="text-caption text-medium-emphasis">
                    On {{ result.issued_at ? new Date(result.issued_at).toLocaleDateString() : '' }}
                </div>
            </v-card>

            <div class="text-caption text-medium-emphasis mt-4">Code: {{ code }}</div>
        </template>

        <template v-else>
            <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-3" />
            <h1 class="text-h5 font-weight-bold mb-1">Not verified</h1>
            <p class="text-body-2 text-medium-emphasis">No certificate matches this code.</p>
        </template>
    </v-card>
</template>
