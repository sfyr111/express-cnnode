const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplySchema = new Schema({
  // creator: Schema.Types.ObjectId, // 只取model对象的ObjectId
  creator: Object,
  content: String
})

const TopicSchema = new Schema({
  creator: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  replyList: [ReplySchema]
})

// TopicSchema.index({ title: 1 }, { unique: true })

const TopicModel = mongoose.model('topic', TopicSchema)

const createANewTopic = async function (params) {
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content
  })
  return await topic.save()
    .catch(e => {
      console.log(e)
      throw new Error(`error creating topic ${JSON.stringify(params)}`)
    })
}

const getTopics = async function (params = { page: 0, pageSize: 10 }) {
  let flow = TopicModel.find({})
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting topics from db')
    })
}

const getTopicsById = async function (topicId) {
  return TopicModel.findOne({ _id: topicId })
    .catch(e => {
      console.log(e)
      throw new Error(`error getting topic by id: ${topicId}`)
    })
}

const updateTopicById = async function (topicId, update) {
  return await TopicModel.findOneAndUpdate({ _id: topicId }, update, { new: true })
    .catch(e => {
      console.log(e)
      throw new Error(`error updating topic by id: ${topicId}`)
    })
}

const replyATopic = async function (params) {
  console.log(params.creator)
  return await TopicModel.findOneAndUpdate(
    { _id: params.topicId }, 
    { $push: { replyList: { creator: params.creator, content: params.content } } },
    { new: true })
    .catch(e => {
      console.log(e)
      throw new Error(`error replying topic ${JSON.stringify(params)}`)
    })
}

module.exports = {
  getTopics,
  replyATopic,
  getTopicsById,
  updateTopicById,
  createANewTopic,
  model: TopicModel
}
