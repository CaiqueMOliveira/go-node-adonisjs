'use strict'

const Task = use('App/Models/Task')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   */
  async index ({ params }) {
    const foundTasks = await Task.query()
      .where('project_id', params.project_id)
      .with('user')
      .fetch()

    return foundTasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   */
  async store ({ request, params }) {
    const newTaskToBeCreated = request.only([
      'title',
      'description',
      'due_date',
      'file_id',
      'user_id'
    ])

    const newTask = await Task.create({
      ...newTaskToBeCreated,
      project_id: params.project_id
    })

    return newTask
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   */
  async show ({ params }) {
    const foundTask = await Task.findOrFail(params.id)

    return foundTask
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   */
  async update ({ params, request }) {
    const foundTask = await Task.findOrFail(params.id)

    const taskDataToBeUpdated = request.only([
      'title',
      'description',
      'due_date',
      'file_id',
      'user_id'
    ])

    await foundTask.merge(taskDataToBeUpdated)

    await foundTask.save()

    return foundTask
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   */
  async destroy ({ params }) {
    const foundTask = await Task.findOrFail(params.id)
    await foundTask.delete()
  }
}

module.exports = TaskController
