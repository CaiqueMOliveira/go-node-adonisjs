'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const foundUser = await User.findByOrFail('email', email)

      foundUser.token = crypto.randomBytes(10).toString('hex')
      foundUser.token_created_at = new Date()

      await foundUser.save()
    } catch (error) {
      return response.status(error.status).send({
        error: {
          message:
            'Something went wrong! Is there an user with this email address?'
        }
      })
    }
  }
}

module.exports = ForgotPasswordController
