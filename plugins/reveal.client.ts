import type { DirectiveBinding } from 'vue'

/**
 * `v-reveal` — fades + lifts an element into view the first time it enters the
 * viewport. Pass a number to stagger the entrance, e.g. `v-reveal="120"` (ms).
 *
 * Client-only: the class is added imperatively in `mounted`, so SSR ships the
 * content visible (no invisible HTML, no hydration mismatch) and JS layers the
 * animation on top. Honours prefers-reduced-motion.
 */
export default defineNuxtPlugin((nuxtApp) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    nuxtApp.vueApp.directive('reveal', {
        mounted(el: HTMLElement, binding: DirectiveBinding<number | undefined>) {
            el.classList.add('reveal')

            if (prefersReduced) {
                el.classList.add('is-visible')
                return
            }

            const delay = typeof binding.value === 'number' ? binding.value : 0
            if (delay > 0) el.style.transitionDelay = `${delay}ms`

            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            el.classList.add('is-visible')
                            observer.unobserve(el)
                        }
                    }
                },
                { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
            )
            observer.observe(el)
        },
    })
})
