'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store')

Route.post('session', 'SessionController.store')

Route.post('password', 'ForgotPasswordController.store')
Route.put('password', 'ForgotPasswordController.update')

Route.get('files/:fileId', 'FileController.show')
Route.post('files', 'FileController.store')
