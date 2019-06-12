'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async index () {
    const foundUsers = await User.all()
    return foundUsers
  }

  async store ({ request }) {
    const userDataForInsertingNewOne = request.only([
      'username',
      'email',
      'password'
    ])

    const transaction = await Database.beginTransaction()

    const newCreatedUser = await User.create(
      userDataForInsertingNewOne,
      transaction
    )

    const addresses = request.input('addresses')

    await newCreatedUser.addresses().createMany(addresses, transaction)

    await transaction.commit()

    return newCreatedUser
  }
}

module.exports = UserController
