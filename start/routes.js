'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')

Route.post('session', 'SessionController.store').validator('Session')

Route.post('password', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('password', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.get('files/:fileId', 'FileController.show')

Route.group(() => {
  Route.post('files', 'FileController.store')

  Route.resource('project', 'ProjectController')
    .apiOnly()
    .validator(new Map([[['project.store'], ['Project']]]))

  Route.resource('project.task', 'TaskController')
    .apiOnly()
    .validator(new Map([[['project.task.store'], ['Task']]]))
}).middleware(['auth'])
