<script setup lang="ts">
const model = defineModel<boolean>({ required: true })
const { primary, groups } = useAppNav()
</script>

<template>
    <v-navigation-drawer v-model="model" temporary width="288">
        <div class="pa-5 pb-3">
            <span class="font-heading text-h6 font-weight-bold text-primary">LUMEN</span>
            <p class="text-caption text-medium-emphasis mb-0">Learn. Grow. Connect.</p>
        </div>

        <!-- On small screens the switcher lives here instead of the app bar -->
        <div class="px-4 pb-2 d-md-none">
            <InstitutionSwitcher />
        </div>

        <v-list density="compact" nav>
            <v-list-item
                v-for="item in primary"
                :key="item.to"
                :to="item.to"
                :prepend-icon="item.icon"
                :title="item.title"
                rounded="lg"
            />

            <template v-for="group in groups" :key="group.title">
                <v-list-subheader class="text-caption font-weight-bold text-uppercase mt-2" style="letter-spacing: 0.06em">
                    {{ group.title }}
                </v-list-subheader>
                <v-list-item
                    v-for="item in group.items"
                    :key="item.to"
                    :to="item.to"
                    :prepend-icon="item.icon"
                    :title="item.title"
                    rounded="lg"
                />
            </template>
        </v-list>
    </v-navigation-drawer>
</template>
