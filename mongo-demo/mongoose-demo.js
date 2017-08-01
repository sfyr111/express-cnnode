const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/class2-test'

mongoose.connect(uri, { useMongoClient: true })
const db = mongoose.connection
const Schema = mongoose.Schema

mongoose.Promise = global.Promise // v8

const UserSchema = new Schema({
  // name: String,
  name: {
    type: String,
    required: true, // 必传
    unique: true, // 创建索引 不可重复
    enum: ['laoyang', 'laozhang', ''] // 指定三个值
  },
  age: {
    type: Number,
    max: 90,
    min: [1, 'nobody could be younger than 1 years old']
  }
})

// 实例方法
UserSchema.methods.sayYourName = function() {
  return this.name
}

// 静态方法
UserSchema.statics.findByName = async function(name) {
  return await this.findOne({ name: name })
}

const UserModel = mongoose.model('user', UserSchema) // model(连接名，规则) - 建模

;(async (params) => {
  // demo1添加 数据
  // let created = await UserModel.create({
  //   name: 'laoyang',
  //   age: 81
  // }).then()

  // return created

  // demo2查找并打印name - 实例方法
  // let found = await UserModel.findOne({}).then()

  // console.log(found.sayYourName())

  // demo3静态方法
  // let found = await UserModel.findByName('laoyang')
  // return found

  // demo4验证信息
  // let user = new UserModel({ name: 'laozhang', age: 88 })
  // await user.save()

  // demo5 工厂模式
  // let flow = UserModel.find({})
  // flow.where('age').lt(90)
  // flow.select({ name: 1 })
  // flow.skip(0)
  // if (params.sort) flow.sort(params.sort)
  
  // let r = await flow.then()
  // return r
})({
  sort: '-age'
})
.then(r => {
  console.log(r)
})
.catch(e => {
  console.log(e.stack)
})

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected!')
})