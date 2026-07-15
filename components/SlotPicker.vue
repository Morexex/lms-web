<script setup lang="ts">
import type { Slot } from '~/types/mentorship'

const props = defineProps<{ profileId: string; serviceId: string; timezone: string }>()
const emit = defineEmits<{ select: [startsAt: string]; }>()

const serviceRef = computed(() => props.serviceId)
const { data: slots, isLoading } = useMentorSlots(props.profileId, serviceRef, props.timezone)

function dayLabel(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', timeZone: props.timezone,
    })
}

function timeLabel(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit', timeZone: props.timezone,
    })
}

const grouped = computed<Array<{ day: string; slots: Slot[] }>>(() => {
    const map = new Map<string, Slot[]>()
    for (const slot of slots.value ?? []) {
        const day = dayLabel(slot.starts_at)
        if (!map.has(day)) map.set(day, [])
        map.get(day)!.push(slot)
    }
    return [...map.entries()].map(([day, list]) => ({ day, slots: list }))
})
</script>

<template>
    <div>
        <v-progress-linear v-if="isLoading" indeterminate color="primary" />
        <p v-else-if="!slots?.length" class="text-body-2 text-medium-emphasis">
            No open slots in the next two weeks.
        </p>

        <div v-for="group in grouped" :key="group.day" class="mb-3">
            <div class="text-caption font-weight-bold text-medium-emphasis mb-1">{{ group.day }}</div>
            <div class="d-flex flex-wrap ga-2">
                <v-btn
                    v-for="s in group.slots"
                    :key="s.starts_at"
                    size="small"
                    variant="tonal"
                    color="primary"
                    @click="emit('select', s.starts_at)"
                >
                    {{ timeLabel(s.starts_at) }}
                </v-btn>
            </div>
        </div>
        <p class="text-caption text-disabled mt-2">Times shown in {{ timezone }}.</p>
    </div>
</template>
