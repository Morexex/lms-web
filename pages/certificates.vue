<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const institution = useInstitutionStore()
const { data: certificates, isLoading } = useMyCertificates()
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-1">Certificates</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">Credentials you've earned.</p>

        <v-alert v-if="!institution.activeSlug" type="info" variant="tonal">
            Select an institution to see your certificates.
        </v-alert>

        <template v-else>
            <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

            <v-row>
                <v-col v-for="c in certificates" :key="c.id" cols="12" md="6">
                    <v-card class="pa-6" border>
                        <div class="d-flex align-center mb-2">
                            <v-icon icon="mdi-certificate" color="accent" size="32" class="mr-3" />
                            <div>
                                <div class="text-body-1 font-weight-bold">{{ c.course_title }}</div>
                                <div class="text-caption text-medium-emphasis">
                                    Issued {{ new Date(c.issued_at).toLocaleDateString() }}
                                </div>
                            </div>
                        </div>
                        <div class="text-caption text-medium-emphasis mb-4">
                            Verification code: <span class="font-weight-medium">{{ c.verification_code }}</span>
                        </div>
                        <div class="d-flex ga-2">
                            <v-btn
                                v-if="c.download_url"
                                :href="c.download_url"
                                target="_blank"
                                color="primary"
                                prepend-icon="mdi-download"
                            >
                                Download PDF
                            </v-btn>
                            <v-btn :to="`/verify/${c.verification_code}`" variant="tonal" prepend-icon="mdi-shield-check">
                                Verify
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
                <v-col v-if="certificates && certificates.length === 0" cols="12">
                    <v-alert type="info" variant="tonal">
                        No certificates yet — complete a course to earn one.
                    </v-alert>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
