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

const enrolled = computed(() => curriculum.value?.enrolled ?? false)
const { data: quizzesTodo } = useQuizzesTodo(courseId, enrolled)
const { data: assignmentsTodo } = useAssignmentsTodo(courseId, enrolled)

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

/** Flat, openable lesson list for prev/next navigation. */
const openableLessons = computed(() =>
    (curriculum.value?.sections ?? []).flatMap((s) => s.lessons).filter((l) => canOpen(l)),
)
const currentIndex = computed(() => openableLessons.value.findIndex((l) => l.id === selectedLessonId.value))
const prevLesson = computed(() => (currentIndex.value > 0 ? openableLessons.value[currentIndex.value - 1] : null))
const nextLesson = computed(() =>
    currentIndex.value >= 0 && currentIndex.value < openableLessons.value.length - 1
        ? openableLessons.value[currentIndex.value + 1]
        : null,
)

const selectedCompleted = computed(() =>
    curriculum.value?.sections
        .flatMap((s) => s.lessons)
        .find((l) => l.id === selectedLessonId.value)?.completed ?? false,
)

function sectionDone(sectionId: string): string {
    const section = curriculum.value?.sections.find((s) => s.id === sectionId)
    if (!section) return ''
    return `${section.lessons.filter((l) => l.completed).length}/${section.lessons.length}`
}

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

        <v-row v-if="isLoading">
            <v-col cols="12" md="4"><v-skeleton-loader type="list-item@6" class="rounded-xl" /></v-col>
            <v-col cols="12" md="8"><v-skeleton-loader type="article, paragraph" class="rounded-xl" /></v-col>
        </v-row>

        <template v-if="curriculum">
            <div class="d-flex align-center flex-wrap ga-3 mb-4">
                <h1 class="font-heading text-h5 font-weight-bold mb-0">{{ curriculum.course.title }}</h1>
                <v-spacer />
                <v-btn v-if="!curriculum.enrolled" color="primary" :loading="enroll.isPending.value" @click="doEnroll">
                    Enroll
                </v-btn>
                <template v-else-if="curriculum.completed">
                    <v-btn color="accent" variant="flat" prepend-icon="mdi-certificate" to="/certificates">
                        View certificate
                    </v-btn>
                    <v-chip color="success" variant="flat" prepend-icon="mdi-check-decagram">Completed</v-chip>
                </template>
                <v-chip v-else color="success" variant="tonal">Enrolled</v-chip>
            </div>
            <v-alert v-if="enrollError" type="warning" variant="tonal" density="compact" class="mb-4">{{ enrollError }}</v-alert>

            <div v-if="curriculum.enrolled" class="mb-5">
                <div class="d-flex align-center justify-space-between mb-1">
                    <span class="text-caption text-medium-emphasis">Your progress</span>
                    <span class="text-caption font-weight-bold text-primary">{{ curriculum.progress.percent }}%</span>
                </div>
                <v-progress-linear :model-value="curriculum.progress.percent" color="primary" height="8" rounded />
            </div>

            <v-row>
                <!-- Curriculum sidebar (sticky on desktop) -->
                <v-col cols="12" md="4">
                    <v-card style="position: sticky; top: 88px; max-height: calc(100vh - 110px); overflow-y: auto">
                        <v-list density="compact" nav>
                            <template v-for="section in curriculum.sections" :key="section.id">
                                <v-list-subheader class="font-weight-bold d-flex">
                                    <span class="flex-grow-1">{{ section.title }}</span>
                                    <span v-if="curriculum.enrolled" class="text-caption text-medium-emphasis ml-2">
                                        {{ sectionDone(section.id) }}
                                    </span>
                                </v-list-subheader>
                                <v-list-item
                                    v-for="l in section.lessons"
                                    :key="l.id"
                                    :active="l.id === selectedLessonId"
                                    :title="l.title"
                                    rounded="lg"
                                    :disabled="!canOpen(l)"
                                    @click="canOpen(l) ? (selectedLessonId = l.id) : null"
                                >
                                    <template #prepend>
                                        <v-icon
                                            :icon="l.completed ? 'mdi-check-circle' : canOpen(l) ? 'mdi-play-circle-outline' : 'mdi-lock-outline'"
                                            :color="l.completed ? 'success' : l.id === selectedLessonId ? 'primary' : undefined"
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
                    <v-card class="pa-6 pa-md-8" min-height="300">
                        <template v-if="lessonLocked">
                            <div class="text-center py-10">
                                <v-avatar color="primary" variant="tonal" size="64" class="mb-4">
                                    <v-icon icon="mdi-lock" size="30" />
                                </v-avatar>
                                <h2 class="text-h6 font-weight-bold mb-1">This lesson is locked</h2>
                                <p class="text-body-2 text-medium-emphasis mb-4">Enroll to unlock the full course.</p>
                                <v-btn color="primary" size="large" :loading="enroll.isPending.value" @click="doEnroll">
                                    Enroll now
                                </v-btn>
                            </div>
                        </template>

                        <template v-else-if="lesson">
                            <h2 class="font-heading text-h5 font-weight-bold mb-5">{{ lesson.title }}</h2>

                            <div v-for="block in lesson.blocks ?? []" :key="block.id" class="mb-6">
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <div v-if="block.type === 'rich_text'" class="text-body-1" style="line-height: 1.7" v-html="block.content?.html" />
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
                                    style="width: 100%; border-radius: 12px"
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

                            <v-divider class="my-5" />

                            <!-- Lesson footer: previous / complete / next -->
                            <div class="d-flex align-center flex-wrap ga-3">
                                <v-btn
                                    v-if="prevLesson"
                                    variant="text"
                                    prepend-icon="mdi-chevron-left"
                                    @click="selectedLessonId = prevLesson.id"
                                >
                                    Previous
                                </v-btn>
                                <v-spacer />
                                <template v-if="curriculum.enrolled">
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
                                </template>
                                <v-btn
                                    v-if="nextLesson"
                                    color="primary"
                                    variant="tonal"
                                    append-icon="mdi-chevron-right"
                                    @click="selectedLessonId = nextLesson.id"
                                >
                                    Next
                                </v-btn>
                            </div>
                        </template>

                        <p v-else class="text-body-2 text-medium-emphasis">Select a lesson to begin.</p>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Assessments -->
            <v-row v-if="enrolled && (quizzesTodo?.length || assignmentsTodo?.length)" class="mt-2">
                <v-col v-if="quizzesTodo?.length" cols="12" md="6">
                    <v-card>
                        <v-card-title class="text-subtitle-1 font-weight-bold">
                            <v-icon icon="mdi-clipboard-text" size="small" class="mr-1" /> Quizzes
                        </v-card-title>
                        <v-list density="compact">
                            <v-list-item
                                v-for="quiz in quizzesTodo"
                                :key="quiz.id"
                                :title="quiz.title"
                                :to="`/quizzes/${quiz.id}`"
                            >
                                <template #subtitle>
                                    {{ quiz.question_count }} questions · pass {{ quiz.passing_score }}%
                                </template>
                                <template #append>
                                    <v-chip
                                        v-if="quiz.best_score !== null"
                                        color="success"
                                        variant="tonal"
                                        size="x-small"
                                    >
                                        best {{ quiz.best_score }}
                                    </v-chip>
                                    <v-icon v-else icon="mdi-chevron-right" size="small" />
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>

                <v-col v-if="assignmentsTodo?.length" cols="12" md="6">
                    <v-card>
                        <v-card-title class="text-subtitle-1 font-weight-bold">
                            <v-icon icon="mdi-file-document-edit" size="small" class="mr-1" /> Assignments
                        </v-card-title>
                        <v-list density="compact">
                            <v-list-item
                                v-for="a in assignmentsTodo"
                                :key="a.id"
                                :title="a.title"
                                :to="`/assignments/${a.id}`"
                            >
                                <template #subtitle>{{ a.points }} points</template>
                                <template #append>
                                    <v-chip
                                        v-if="a.submission"
                                        :color="a.submission.status === 'graded' ? 'success' : 'info'"
                                        variant="tonal"
                                        size="x-small"
                                    >
                                        {{ a.submission.status === 'graded' ? `${a.submission.score} pts` : 'submitted' }}
                                    </v-chip>
                                    <v-icon v-else icon="mdi-chevron-right" size="small" />
                                </template>
                            </v-list-item>
                        </v-list>
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
    border-radius: 12px;
}
</style>
