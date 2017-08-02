const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')

// /topic/
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let topics = await Topic.getTopics()
      return {
        topics,
        code: 0
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .post((req, res, next) => {
    (async () => {
      const user = await User.getUsersById(req.body.userId)
      let topic = await Topic.createANewTopic({
        creator: user,
        title: req.body.title,
        content: req.body.content
      })
      return {
        topic,
        code: 0
      }
    })()
      .then(r => {
         res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

// /topic/name
router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let topic = await Topic.getTopicsById(req.params.id)
      return {
        topic,
        code: 0
      }
    })()
      .then(r => {
         res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .patch((req, res) => {
    (async () => {
      let topic = await Topic.updateTopicById(req.params.id, {
        content: req.body.content
      })
      return {
        topic,
        code: 0
      }
    })()
      .then(r => {
         res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })

  router.route('/:id/reply')
    .post((req, res, next) => {
      (async () => {
        const user = await User.getUsersById(req.body.userId)
        let topic = await Topic.replyATopic({
          creator: user,
          topicId: req.params.id,
          content: req.body.content
        })
        return {
          topic,
          code: 0
        }
      })()
        .then(r => {
          res.json(r)
        })
        .catch(e => {
          next(e)
        })
    })

module.exports = router
