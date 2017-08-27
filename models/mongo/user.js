const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const util = require('util')
const pbkdf2Async = util.promisify(crypto.pbkdf2)
const SALT = require('../../cipher').PASSWORD_SALT
// const SECRET = require('../../cipher').JWT_SECRET
const Errors = require('../../error')
const logger = require('../../utils/logger').logger

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    max: [90, 'Nobody over 90 could use postman`']
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: String,
  avatar: String,
  openId: {
    type: String,
    index: true
  }
})

UserSchema.index({ name: 1 }, { unique: true }) // 创建唯一索引
UserSchema.index({ name: 1, age: 1 })

const DEFAULT_PROJECTION = { password: 0, phoneNumber: 0, __v: 0 } // 0 数据查询不显示 select()

const UserModel = mongoose.model('user', UserSchema)

const createANewUser = async function (params) {
  const user = new UserModel({
    name: params.name,
    age: params.age,
    phoneNumber: params.phoneNumber,
    openId: params.openId
  })

  if (params.password) {
    user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
      .then(r => r.toString())
      .catch(e => {
        console.log(e)
        throw new Error('something goes wrong inside the server')
      })
  }
  
  let created = await user.save()
    .catch(e => {
      logger.error('error creating user', e)
      switch (e.code) {
        case 11000: {
          throw new Errors.DuplicatedUserNameError(params.name, 'someone has picked that name, choose an other!')
          break
        }
        default: {
          throw new Errors.ValidateionError('user', `error creating user ${JSON.stringify(params)}. ${e.message}`)
          break
        }
      }
    })
    
    return {
      _id: created._id,
      name: created.name,
      age: created.age
    }
}

const getUsers = async function (params = { page: 0, pageSize: 10 }) {
  let flow = UserModel.find({})
  flow.select(DEFAULT_PROJECTION)
  flow.skip(params.page * params.pageSize) // 跳过的文档数
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
}

const getUsersById = async function (userId) {
  return UserModel.findOne({ _id: userId })
    .select(DEFAULT_PROJECTION) // 数据库
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${userId}`)
    })
}

const updateUserById = async function (userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update,  { new: true }) // new: true 返回修改完的数据
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e)
      throw new Error(`error updating user by id: ${userId}`)
    })
}

const login = async function (phoneNumber, password) {
  password = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      console.log(e)
      throw new Errors.InternalError('something goes wrong inside the server')
    })

  const user = await UserModel.findOne({ phoneNumber: phoneNumber, password: password})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(`error logging in, phone ${phoneNumber}, err: ${e.stack || e}`)
      throw new Error(`something wrong with the server`)
    })

    if (!user) throw new Error('No such user!')
    return user
}

const loginWithWechat = async function (user) {
  let found = await UserModel.findOne({ openId: user.openid })
  if (found) return found

  let created = await createANewUser({ name: user.nickname, openId: user.openid })
  return created
}

module.exports = {
  login,
  getUsers,
  getUsersById,
  createANewUser,
  updateUserById,
  loginWithWechat,
  model: UserModel
}
