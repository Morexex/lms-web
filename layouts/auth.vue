<template>
    <v-app>
        <v-main class="bg-background">
            <v-container class="fill-height d-flex align-center justify-center py-12">
                <div class="w-100" style="max-width: 440px">
                    <div class="text-center mb-8">
                        <span class="font-heading text-h4 font-weight-bold text-primary">LUMEN</span>
                        <p class="text-body-2 text-medium-emphasis mt-1">Learn. Grow. Connect.</p>
                    </div>
                    <slot />
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>
