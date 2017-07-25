const express = require('express')
const router = express.Router()
const User = require('../models/in_memo/user')

// /user/
router.route('/')
  .get((req, res, next) => {
    
    res.send('trying to get user list')
  })
  .post((req, res) => {
    res.send('trying to create a user')
  })

// /user/name
router.route('/:id')
  .get((req, res, next) => {
    res.send('trying to get a user')
  })
  .patch((req, res) => {
    res.send('trying to modify a user')
  })

module.exports = router
