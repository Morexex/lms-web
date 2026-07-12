export default defineNuxtPlugin(async () => {
    // Client-only: attempt a silent session restore before the app renders.
    await useAuthStore().init()
})
