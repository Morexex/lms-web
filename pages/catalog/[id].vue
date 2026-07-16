<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const id = useRoute().params.id as string
const { data: course, isLoading, isError } = useCatalogCourse(id)
const enroll = useEnroll()
const { message: enrollMessage, handle: handleEnroll, reset } = useApiErrors()
const buying = ref(false)

const priceOptions = computed(() => {
    if (!course.value || course.value.is_free) return []
    if (course.value.prices?.length) return course.value.prices
    if (course.value.price_currency && course.value.price_amount !== null) {
        return [{ currency: course.value.price_currency, amount: course.value.price_amount }]
    }
    return []
})

async function doEnroll(): Promise<void> {
    if (course.value && !course.value.is_free) {
        buying.value = true
        return
    }
    reset()
    try {
        await enroll.mutateAsync(id)
        await navigateTo(`/learn/${id}`)
    } catch (error) {
        handleEnroll(error)
    }
}

const included = [
    { icon: 'mdi-play-circle-outline', text: 'Learn at your own pace' },
    { icon: 'mdi-certificate-outline', text: 'Verifiable certificate on completion' },
    { icon: 'mdi-forum-outline', text: 'Course community & discussions' },
    { icon: 'mdi-cellphone-link', text: 'Works on any device' },
] as const
</script>

<template>
    <div style="max-width: 1000px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/catalog" class="mb-4">Back to catalog</v-btn>

        <v-row v-if="isLoading">
            <v-col cols="12" md="8"><v-skeleton-loader type="image, article, paragraph" class="rounded-xl" /></v-col>
            <v-col cols="12" md="4"><v-skeleton-loader type="article, actions" class="rounded-xl" /></v-col>
        </v-row>

        <v-alert v-else-if="isError || !course" type="warning" variant="tonal">
            This course isn't available.
        </v-alert>

        <v-row v-else>
            <!-- Course content -->
            <v-col cols="12" md="8">
                <v-img
                    v-if="course.cover_image_url"
                    :src="course.cover_image_url"
                    height="260"
                    cover
                    rounded="xl"
                    class="mb-5"
                />
                <div class="text-caption text-primary font-weight-medium mb-1">
                    {{ course.category?.name ?? 'General' }}
                </div>
                <h1 class="font-heading text-h4 font-weight-bold mb-3" style="line-height: 1.2">{{ course.title }}</h1>
                <v-chip variant="tonal" size="small" class="mb-5">{{ courseLevelLabel(course.level) }}</v-chip>

                <p class="text-h6 font-weight-regular text-medium-emphasis mb-5" style="line-height: 1.5">
                    {{ course.summary }}
                </p>

                <v-card class="pa-6" variant="outlined">
                    <h2 class="text-subtitle-1 font-weight-bold mb-3">About this course</h2>
                    <p class="text-body-1 mb-0" style="white-space: pre-wrap; line-height: 1.7">{{ course.description }}</p>
                </v-card>
            </v-col>

            <!-- Sticky enrollment card -->
            <v-col cols="12" md="4">
                <div style="position: sticky; top: 88px">
                    <v-card class="pa-6">
                        <div class="d-flex align-baseline ga-2 mb-4">
                            <span class="text-h4 font-weight-bold" :class="course.is_free ? 'text-success' : 'text-primary'">
                                {{ formatPrice(course) }}
                            </span>
                        </div>

                        <v-alert v-if="enrollMessage" type="warning" variant="tonal" density="compact" class="mb-3">
                            {{ enrollMessage }}
                        </v-alert>

                        <v-btn
                            color="primary"
                            size="large"
                            block
                            class="mb-4 font-weight-bold"
                            :loading="enroll.isPending.value"
                            @click="doEnroll"
                        >
                            {{ course.is_free ? 'Enroll for free' : 'Buy this course' }}
                        </v-btn>

                        <v-divider class="mb-4" />
                        <p class="text-caption font-weight-bold text-medium-emphasis mb-3">THIS COURSE INCLUDES</p>
                        <div class="d-flex flex-column ga-3">
                            <div v-for="item in included" :key="item.icon" class="d-flex align-center ga-3">
                                <v-icon :icon="item.icon" size="20" color="primary" />
                                <span class="text-body-2">{{ item.text }}</span>
                            </div>
                        </div>
                    </v-card>
                </div>
            </v-col>
        </v-row>

        <CheckoutDialog
            v-if="buying && course"
            :course-id="id"
            :title="course.title"
            :prices="priceOptions"
            @close="buying = false"
        />
    </div>
</template>
