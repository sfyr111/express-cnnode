const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    max: [90, 'Nobody over 90 could use postman`']
  }
})

UserSchema.index({ name: 1 }, { unique: true }) // 创建唯一索引
// UserSchema.index({ name: 1, age: 1 }) // 混合索引，1正序，-1倒序，空间换时间

/* 
非常快-非常慢
内存->遍历文档

非常快-比较快-  比较快
内存->寻找索引->根据索引取文档 

只取name和age
内存->寻找索引

稀疏索引，不一定要有值，效率低一点
sparseIndex

in_memory 缓存内存数据库

LRU 最近访问的多少个在缓存内

geoIndex 地理位置索引
*/

const UserModel = mongoose.model('user', UserSchema)

const createANewUser = async function (params) {
  const user = new UserModel({
    name: params.name,
    age: params.age
  })
  return await user.save()
    .catch(e => {
      console.log(e)
      switch (e.code) {
        case 11000: {
          throw new Error('someone has picked that name, choose an other!')
          break
        }
        default: {
          throw new Error(`error creating user ${JSON.stringify(params)}. ${e.message}`)
          break
        }
      }
    })
}

const getUsers = async function (params = { page: 0, pageSize: 10 }) {
  let flow = UserModel.find({})
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
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${userId}`)
    })
}

const updateUserById = async function (userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update,  { new: true }) // new: true 返回修改完的数据
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
