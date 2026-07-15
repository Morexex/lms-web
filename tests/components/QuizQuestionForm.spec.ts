import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import QuizQuestionForm from '~/components/QuizQuestionForm.vue'
import type { Question } from '~/types/assessment'

describe('QuizQuestionForm', () => {
    it('emits a normalised payload for a single-choice question', async () => {
        const wrapper = await mountSuspended(QuizQuestionForm)

        // Fill the prompt.
        const prompt = wrapper.find('textarea')
        await prompt.setValue('What is 2 + 2?')

        // Fill both option texts (the last two text inputs; the first is the
        // type <v-select>).
        const textInputs = wrapper.findAll('input[type="text"]')
        await textInputs[textInputs.length - 2]!.setValue('3')
        await textInputs[textInputs.length - 1]!.setValue('4')

        // Pick the second option as correct.
        const radios = wrapper.findAll('input[type="radio"]')
        await radios[1]!.setValue()

        const addBtn = wrapper.findAll('button').find((b) => b.text().includes('Add question'))
        await addBtn!.trigger('click')

        const saves = wrapper.emitted('save')
        expect(saves).toBeTruthy()
        const payload = saves!.at(-1)![0] as Record<string, unknown>
        expect(payload.type).toBe('single_choice')
        expect(payload.prompt).toBe('What is 2 + 2?')
        expect(payload.correct).toHaveLength(1)
        expect((payload.options as unknown[]).length).toBe(2)
    })

    it('omits the type when editing an existing question', async () => {
        const question: Question = {
            id: 'q1',
            type: 'true_false',
            prompt: 'The sky is blue',
            options: null,
            correct: ['true'],
            points: 1,
            position: 1,
        }
        const wrapper = await mountSuspended(QuizQuestionForm, { props: { question } })

        const buttons = wrapper.findAll('button')
        const saveBtn = buttons.find((b) => b.text().includes('Save question'))
        await saveBtn!.trigger('click')

        const payload = wrapper.emitted('save')!.at(-1)![0] as Record<string, unknown>
        expect(payload.type).toBeUndefined()
        expect(payload.correct).toEqual(['true'])
    })
})
