const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number
  }
})

const UserModel = mongoose.model('user', UserSchema)

const createANewUser = async function (params) {
  const user = new UserModel({
    name: params.name,
    age: params.age
  })
  return await user.save()
    .catch(e => {
      console.log(e)
      throw new Error(`error creating user ${JSON.stringify(params)}`)
    })
}

const getUsers = async function (params = { page: 0, pageSize: 10 }) {
  let flow = UserModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
}

const getUsersById = async function (userId) {
  return UserModel.findOne({ _id: userId })
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${userId}`)
    })
}

const updateUserById = async function (userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update,  {new: true })
    .catch(e => {
      console.log(e)
      throw new Error(`error updating user by id: ${userId}`)
    })
}

module.exports = {
  getUsers,
  getUsersById,
  createANewUser,
  updateUserById,
  model: UserModel
}