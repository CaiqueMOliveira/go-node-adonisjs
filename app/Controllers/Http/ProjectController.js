'use strict'

const Project = use('App/Models/Project')

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   */
  async index () {
    const foundProjects = await Project.query()
      .with('user')
      .fetch()
    return foundProjects
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   */
  async store ({ request, auth }) {
    const projectToBeCreated = request.only(['title', 'description'])
    const newProject = await Project.create({
      ...projectToBeCreated,
      user_id: auth.user.id
    })
    return newProject
  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   */
  async show ({ params, response }) {
    try {
      const foundProject = await Project.findOrFail(params.id)

      await foundProject.loadMany(['user', 'tasks'])

      return foundProject
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: 'Something went wrong while getting the project'
        }
      })
    }
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   */
  async update ({ params, request, response }) {
    try {
      const updatedProjectValues = request.only(['title', 'description'])
      const foundProject = await Project.findOrFail(params.id)

      await foundProject.merge(updatedProjectValues)

      await foundProject.save()

      return foundProject
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: 'Something went wrong while getting the project'
        }
      })
    }
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   */
  async destroy ({ params, response }) {
    try {
      const foundProject = await Project.findOrFail(params.id)

      await foundProject.delete()
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message: 'Something went wrong while getting the project'
        }
      })
    }
  }
}

module.exports = ProjectController
