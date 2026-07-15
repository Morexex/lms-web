<script setup lang="ts">
import type { Course } from '~/types/catalog'
import type { MediaItem } from '~/types/media'

const props = defineProps<{ course?: Course; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: Record<string, unknown>] }>()

const { data: categories } = useCategories()

const title = ref(props.course?.title ?? '')
const summary = ref(props.course?.summary ?? '')
const description = ref(props.course?.description ?? '')
const level = ref(props.course?.level ?? 'all_levels')
const categoryId = ref<string | null>(props.course?.category?.id ?? null)
const isFree = ref(props.course?.is_free ?? true)
const price = ref(props.course?.price_amount ? props.course.price_amount / 100 : 0)
const currency = ref(props.course?.price_currency ?? 'KES')
const coverMediaId = ref<string | null>(props.course?.cover_media_id ?? null)
const coverUrl = ref<string | null>(props.course?.cover_image_url ?? null)

function onCoverUploaded(media: MediaItem): void {
    coverMediaId.value = media.id
    coverUrl.value = media.url
}

const levels = [
    { title: 'All levels', value: 'all_levels' },
    { title: 'Beginner', value: 'beginner' },
    { title: 'Intermediate', value: 'intermediate' },
    { title: 'Advanced', value: 'advanced' },
]

const categoryItems = computed(() => (categories.value ?? []).map((c) => ({ title: c.name, value: c.id })))

function submit(): void {
    emit('submit', {
        title: title.value,
        summary: summary.value || null,
        description: description.value || null,
        level: level.value,
        category_id: categoryId.value,
        is_free: isFree.value,
        price_amount: isFree.value ? null : Math.round(price.value * 100),
        price_currency: isFree.value ? null : currency.value,
        cover_media_id: coverMediaId.value,
    })
}
</script>

<template>
    <v-card class="pa-6">
        <div class="mb-4">
            <div class="text-subtitle-2 font-weight-bold mb-2">Cover image</div>
            <v-img v-if="coverUrl" :src="coverUrl" height="140" cover rounded="lg" class="mb-2" style="max-width: 260px" />
            <MediaUpload accept="image/*" label="Upload cover image" @uploaded="onCoverUploaded" />
        </div>

        <v-text-field v-model="title" label="Course title" />
        <v-text-field v-model="summary" label="Short summary" counter="280" class="mt-2" />
        <v-textarea v-model="description" label="Description" rows="4" auto-grow class="mt-2" />

        <v-row class="mt-1">
            <v-col cols="12" sm="6">
                <v-select v-model="level" :items="levels" label="Level" />
            </v-col>
            <v-col cols="12" sm="6">
                <v-select v-model="categoryId" :items="categoryItems" label="Category" clearable />
            </v-col>
        </v-row>

        <v-switch v-model="isFree" label="Free course" color="primary" hide-details class="mb-2" />
        <v-row v-if="!isFree">
            <v-col cols="8">
                <v-text-field v-model.number="price" label="Price" type="number" min="0" prefix="amount" />
            </v-col>
            <v-col cols="4">
                <v-text-field v-model="currency" label="Currency" maxlength="3" />
            </v-col>
        </v-row>

        <v-btn color="primary" size="large" :loading="loading" class="mt-2" @click="submit">
            {{ props.course ? 'Save changes' : 'Create course' }}
        </v-btn>
    </v-card>
</template>
