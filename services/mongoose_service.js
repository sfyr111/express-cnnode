const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27017/express-cnnode'

mongoose.Promise = global.Promise

mongoose.connect(uri, { userMongoClient: true })

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('mongo connect!')
})

module.exports = db