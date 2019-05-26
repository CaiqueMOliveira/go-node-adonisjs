'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.all()

    const newGeneratedToken = auth.attempt(email, password)

    return newGeneratedToken
  }
}

module.exports = SessionController
