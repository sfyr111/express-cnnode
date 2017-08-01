let TOPIC_ID_INIT = 10000
const topics = []

class Topic {
  constructor (params) {
    if (!params.creator) throw { code: -1, msg: 'a topic must be sent by a creator'}
    if (!params.title) throw { code: -1, msg: 'a topic must contain a title'}
    if (params.content.length < 5) throw { code: -1, msg: "a topic's content must be longer than 5 charaters"}
    this.title = params.title
    this.content = params.content
    this.replyList = []
    this._id = TOPIC_ID_INIT++
  }
}

const createANewTopic = function (params) {
  const topic = new Topic(params)
  topics.push(topic)
  return topic
}

const getTopics = async function (params) {
  return topics
}

const getTopicsById = async function (topicId) {
  return topics.find(topic => topic._id === topicId)
}

const updateTopicById = async function (topicId, update) {
  const topic = topics.find(topic => topic._id === topicId)
  if (update.name) topic.name = update.name
  if (update.age) topic.age = updata.age
}

const replyATopic = async function (params) {
  const topic = topics.find(t => Number(params.topicId) === t._id)
  topic.replyList.push({
    creator: params.creator,
    content: params.content,
  })
  return topic
}

module.exports = {
  model: Topic,
  getTopics,
  replyATopic,
  getTopicsById,
  createANewTopic,
  updateTopicById
}