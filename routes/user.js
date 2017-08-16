const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const auth = require('../middlewares/auth_user')
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join('http://ouf9z0fow.bkt.clouddn.com/image/') })

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
        age: req.body.age,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
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
      let user = await User.getUsersById(req.params.id)
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
  .patch(auth(), upload.single('avatar'), (req, res, next) => {
    (async () => {
      let update = {}
      if (req.body.name) update.name = req.body.name
      if (req.body.age) update.age = req.body.age
      console.log(req.file)
      let user = await User.updateUserById(req.params.id, update)
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
