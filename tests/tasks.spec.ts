import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import { TaskModel } from './fixtures/task.model'
import { postTask, deleteTaskByHelper } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'


let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})
//describe organiza por contexto
test.describe('cadastro', () => {

    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {

        const task = data.success as TaskModel

        await deleteTaskByHelper(request, task.name)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {

        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async () => {

        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {

    test('deve concluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name) //garantir que sempre estará is_done: false (não concluída)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)

    })
})

test.describe('exclusão', () => {

    test('deve excluir uma tarefa', async ({ request }) => {
        const task = data.delete as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.deleteTaskByName(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})




