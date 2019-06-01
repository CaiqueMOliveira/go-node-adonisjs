'use strict'

const moment = require('moment')
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

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const foundUser = await User.findBy('token', token)

      if (!foundUser) {
        return response.status(404).send({ message: 'invalid token' })
      }

      const tokenHasBeenExpired = moment()
        .subtract(2, 'days')
        .isAfter(foundUser.token_created_at)

      if (tokenHasBeenExpired) {
        return response
          .status(401)
          .send({ message: 'The informed token has been expired' })
      }

      foundUser.token = null
      foundUser.token_created_at = null
      foundUser.password = password

      await foundUser.save()
    } catch (error) {
      return response.status(error.status).send({
        message: 'Something went wrong while resetting your password!',
        rawError: error.message
      })
    }
  }
}

module.exports = ForgotPasswordController
