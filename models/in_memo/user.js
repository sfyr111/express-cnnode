let USER_ID_INIT = 10000
const users = []

class User {
  constructor (params) {
    if (!params.name || !params.age) throw new Error('name and age required when creating a user!')
    this.name = params.name
    this.age = params.age
    this._id = USER_ID_INIT++
  }
}

const createANewUser = function (params) {
  const user = new User(params)
  users.push(user)
  return user
}

const getUsers = async function (params) {
  return users
}

const getUsersById = async function (userId) {
  return users.find(user => user._id === Number(userId))
}

const updateUserById = async function (userId, update) {
  const user = users.find(user => user._id === userId)
  if (update.name) user.name = update.name
  if (update.age) user.age = updata.age
}

module.exports = {
  model: User,
  getUsers,
  getUsersById,
  createANewUser,
  updateUserById
}