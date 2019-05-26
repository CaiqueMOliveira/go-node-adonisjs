'use strict'

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const foundUser = await User.findByOrFail('email', email)

      foundUser.token = crypto.randomBytes(10).toString('hex')
      foundUser.token_created_at = new Date()

      await foundUser.save()

      Mail.send(
        ['emails.forgot_password'],
        {
          token: foundUser.token,
          link: `http://mywebsite.com/reset_password?token=${foundUser.token}`
        },
        mail => {
          mail
            .to(email)
            .from('caique.m.oliveira.br@gmail.com', 'Caique M. Oliveira')
            .subject('Password Recovering')
        }
      )
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
