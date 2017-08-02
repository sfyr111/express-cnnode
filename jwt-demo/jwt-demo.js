const JWT = require('jsonwebtoken')
const SECRET = 'secret string'
const crypto = require('crypto')
const util = require('util')

let token = JWT.sign({
  userId: 'yang',
  iat: Date.now(),
  expire: Date.now() + 24 * 60 * 60 * 1000
}, SECRET)

let verified = JWT.verify(token, SECRET)

let pbkdf2Async = util.promisify(crypto.pbkdf2)

;(async () => {
  return await pbkdf2Async('password', 'salt', 10000, 512, 'sha512')
})()
  .then(r => {
    console.log(r)
  })
  .catch(e => {
    console.log(e)
  })
  