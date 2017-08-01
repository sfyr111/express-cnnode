const express = require('express')
const router = express.Router()
// const User = require('../models/in_memo/user')
const User = require('../models/mongo/user')

// /user/
router.route('/')
  .get((req, res, next) => {
    (async () => {
      let users = await User.getUsers()
      return {
        users,
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
      let user = await User.createANewUser({
        name: req.body.name,
        age: req.body.age
      })
      return {
        user,
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

// /user/name
router.route('/:id')
  .get((req, res, next) => {
    (async () => {
      let user = await User.getUsersById(Number(req.params.id))
      return {
        user,
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
      let user = await User.updateUserById(Number(req.params.id), {
        name: req.body.name,
        age: req.body.age
      })
      return {
        user,
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
