import { expect, test } from '@playwright/test'
import { TasksPage } from './support/pages/tasks'

test('webapp deve estar online', async ({ page }) => {

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
})