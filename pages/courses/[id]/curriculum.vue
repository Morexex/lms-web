<script setup lang="ts">
import type { Section } from '~/types/learning'

definePageMeta({ middleware: 'auth' })

const courseId = useRoute().params.id as string
const { data: course } = useCourse(courseId)
const { data: sections, isLoading } = useCurriculum(courseId)
const a = useCurriculumActions(courseId)

const newSectionTitle = ref('')
const newLessonTitle = ref<Record<string, string>>({})
const editingLessonId = ref<string | null>(null)

async function addSection(): Promise<void> {
    if (!newSectionTitle.value) return
    await a.createSection.mutateAsync(newSectionTitle.value)
    newSectionTitle.value = ''
}

async function addLesson(sectionId: string): Promise<void> {
    const title = newLessonTitle.value[sectionId]
    if (!title) return
    await a.createLesson.mutateAsync({ sectionId, title, is_preview: false })
    newLessonTitle.value[sectionId] = ''
}

function moveSection(index: number, dir: -1 | 1): void {
    const list = [...(sections.value ?? [])]
    const target = index + dir
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    a.reorderSections.mutate(list.map((s) => s.id))
}

function moveLesson(section: Section, index: number, dir: -1 | 1): void {
    const list = [...section.lessons]
    const target = index + dir
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    a.reorderLessons.mutate({ sectionId: section.id, ids: list.map((l) => l.id) })
}
</script>

<template>
    <div style="max-width: 820px">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" :to="`/courses/${courseId}`" class="mb-2">Back to course</v-btn>
        <h1 class="text-h4 font-weight-bold mb-1">Curriculum</h1>
        <p class="text-body-1 text-medium-emphasis mb-6">{{ course?.title }}</p>

        <v-progress-linear v-if="isLoading" indeterminate color="primary" class="mb-4" />

        <v-expansion-panels v-if="sections?.length" multiple class="mb-4">
            <v-expansion-panel v-for="(section, si) in sections" :key="section.id">
                <v-expansion-panel-title>
                    <div class="d-flex align-center w-100">
                        <span class="font-weight-medium">{{ section.title }}</span>
                        <v-spacer />
                        <span class="text-caption text-medium-emphasis mr-2">{{ section.lessons.length }} lessons</span>
                        <v-btn icon="mdi-arrow-up" size="x-small" variant="text" @click.stop="moveSection(si, -1)" />
                        <v-btn icon="mdi-arrow-down" size="x-small" variant="text" @click.stop="moveSection(si, 1)" />
                        <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click.stop="a.deleteSection.mutate(section.id)" />
                    </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <v-list density="compact">
                        <v-list-item v-for="(lesson, li) in section.lessons" :key="lesson.id" :title="lesson.title">
                            <template #append>
                                <v-chip v-if="lesson.is_preview" size="x-small" color="accent" variant="tonal" class="mr-2">preview</v-chip>
                                <v-switch
                                    :model-value="lesson.is_preview"
                                    color="accent"
                                    density="compact"
                                    hide-details
                                    class="mr-2"
                                    @update:model-value="(v) => a.updateLesson.mutate({ id: lesson.id, is_preview: Boolean(v) })"
                                />
                                <v-btn size="x-small" variant="text" @click="editingLessonId = lesson.id">Content</v-btn>
                                <v-btn icon="mdi-arrow-up" size="x-small" variant="text" @click="moveLesson(section, li, -1)" />
                                <v-btn icon="mdi-arrow-down" size="x-small" variant="text" @click="moveLesson(section, li, 1)" />
                                <v-btn icon="mdi-delete" size="x-small" variant="text" color="error" @click="a.deleteLesson.mutate(lesson.id)" />
                            </template>
                        </v-list-item>
                    </v-list>

                    <div class="d-flex ga-2 mt-2">
                        <v-text-field
                            v-model="newLessonTitle[section.id]"
                            label="New lesson title"
                            density="compact"
                            hide-details
                            @keyup.enter="addLesson(section.id)"
                        />
                        <v-btn color="primary" variant="tonal" @click="addLesson(section.id)">Add lesson</v-btn>
                    </div>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="pa-4">
            <div class="d-flex ga-2">
                <v-text-field v-model="newSectionTitle" label="New section title" density="compact" hide-details @keyup.enter="addSection" />
                <v-btn color="primary" @click="addSection">Add section</v-btn>
            </div>
        </v-card>

        <LessonBlocksDialog
            v-if="editingLessonId"
            :key="editingLessonId"
            :lesson-id="editingLessonId"
            @close="editingLessonId = null"
        />
    </div>
</template>
