<script setup lang="ts">
import type { LearnLesson } from '~/types/learning'

definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: curriculum, isLoading } = useLearnCurriculum(courseId)
const enroll = useEnroll()
const complete = useCompleteLesson(courseId)
const { message: enrollError, handle: handleEnroll, reset } = useApiErrors()

const selectedLessonId = ref<string | null>(null)
const { data: lesson, isError: lessonLocked } = useLearnLesson(courseId, selectedLessonId)

// Auto-select the first lesson once the curriculum loads.
watchEffect(() => {
    if (!selectedLessonId.value && curriculum.value?.sections.length) {
        const first = curriculum.value.sections.find((s) => s.lessons.length)?.lessons[0]
        if (first) selectedLessonId.value = first.id
    }
})

function canOpen(l: LearnLesson): boolean {
    return (curriculum.value?.enrolled ?? false) || l.is_preview
}

const selectedCompleted = computed(() =>
    curriculum.value?.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.id === selectedLessonId.value)?.completed ?? false,
)

async function doEnroll(): Promise<void> {
    reset()
    try {
        await enroll.mutateAsync(courseId)
    } catch (error) {
        handleEnroll(error)
    }
}
</script>

<template>
    <div>
        <v-btn variant="text" prepend-icon="mdi-arrow-left" to="/learning" class="mb-2">My learning</v-btn>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />

        <template v-if="curriculum">
            <div class="d-flex align-center mb-4">
                <h1 class="text-h5 font-weight-bold">{{ curriculum.course.title }}</h1>
                <v-spacer />
                <v-btn v-if="!curriculum.enrolled" color="primary" :loading="enroll.isPending.value" @click="doEnroll">
                    Enroll
                </v-btn>
                <v-chip v-else-if="curriculum.completed" color="success" variant="flat" prepend-icon="mdi-check-decagram">Completed</v-chip>
                <v-chip v-else color="success" variant="tonal">Enrolled</v-chip>
            </div>
            <v-alert v-if="enrollError" type="warning" variant="tonal" density="compact" class="mb-4">{{ enrollError }}</v-alert>

            <div v-if="curriculum.enrolled" class="mb-4">
                <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-medium-emphasis">Your progress</span>
                    <span class="text-caption font-weight-medium">{{ curriculum.progress.percent }}%</span>
                </div>
                <v-progress-linear :model-value="curriculum.progress.percent" color="primary" height="8" rounded />
            </div>

            <v-row>
                <!-- Curriculum sidebar -->
                <v-col cols="12" md="4">
                    <v-card>
                        <v-list density="compact">
                            <template v-for="section in curriculum.sections" :key="section.id">
                                <v-list-subheader class="font-weight-bold">{{ section.title }}</v-list-subheader>
                                <v-list-item
                                    v-for="l in section.lessons"
                                    :key="l.id"
                                    :active="l.id === selectedLessonId"
                                    :title="l.title"
                                    @click="canOpen(l) ? (selectedLessonId = l.id) : null"
                                >
                                    <template #prepend>
                                        <v-icon
                                            :icon="l.completed ? 'mdi-check-circle' : canOpen(l) ? 'mdi-play-circle-outline' : 'mdi-lock-outline'"
                                            :color="l.completed ? 'success' : undefined"
                                            size="small"
                                        />
                                    </template>
                                    <template #append>
                                        <v-chip v-if="l.is_preview && !curriculum.enrolled" size="x-small" color="accent" variant="tonal">
                                            preview
                                        </v-chip>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-card>
                </v-col>

                <!-- Lesson content -->
                <v-col cols="12" md="8">
                    <v-card class="pa-6" min-height="300">
                        <template v-if="lessonLocked">
                            <div class="text-center py-8">
                                <v-icon icon="mdi-lock" size="48" color="medium-emphasis" class="mb-3" />
                                <p class="text-body-1 mb-4">Enroll to unlock this lesson.</p>
                                <v-btn color="primary" :loading="enroll.isPending.value" @click="doEnroll">Enroll now</v-btn>
                            </div>
                        </template>
                        <template v-else-if="lesson">
                            <h2 class="text-h6 font-weight-bold mb-4">{{ lesson.title }}</h2>
                            <div v-for="block in lesson.blocks ?? []" :key="block.id" class="mb-6">
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <div v-if="block.type === 'rich_text'" class="text-body-1" v-html="block.content?.html" />
                                <div v-else-if="block.type === 'embed'" class="embed-wrap">
                                    <iframe
                                        :src="toEmbedUrl(String(block.content?.url ?? ''))"
                                        frameborder="0"
                                        allowfullscreen
                                        title="Lesson video"
                                    />
                                </div>
                                <video
                                    v-else-if="block.type === 'video' && block.media_url"
                                    :src="block.media_url"
                                    controls
                                    style="width: 100%; border-radius: 8px"
                                />
                                <v-btn
                                    v-else-if="block.type === 'resource'"
                                    :href="block.media_url ?? undefined"
                                    target="_blank"
                                    color="primary"
                                    variant="tonal"
                                    prepend-icon="mdi-file-download"
                                >
                                    {{ String(block.content?.filename ?? 'Download resource') }}
                                </v-btn>
                            </div>
                            <p v-if="(lesson.blocks ?? []).length === 0" class="text-body-2 text-medium-emphasis">
                                This lesson has no content yet.
                            </p>

                            <v-divider v-if="curriculum.enrolled" class="my-4" />
                            <div v-if="curriculum.enrolled" class="d-flex justify-end">
                                <v-chip v-if="selectedCompleted" color="success" variant="tonal" prepend-icon="mdi-check">
                                    Completed
                                </v-chip>
                                <v-btn
                                    v-else
                                    color="primary"
                                    :loading="complete.isPending.value"
                                    prepend-icon="mdi-check"
                                    @click="selectedLessonId && complete.mutate(selectedLessonId)"
                                >
                                    Mark complete
                                </v-btn>
                            </div>
                        </template>
                        <p v-else class="text-body-2 text-medium-emphasis">Select a lesson to begin.</p>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </div>
</template>

<style scoped>
.embed-wrap {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
}
.embed-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
}
</style>
