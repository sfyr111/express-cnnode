const winston = require('winston')
require('winston-daily-rotate-file')

const logger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'info-logger',
      filename: './info.log',
      datePattern: 'yyyy-MM-dd',
      // level: 'verbose'
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      name: 'error-logger',
      filename: './error.log',
      datePattern: 'yyyy-MM-dd',
      level: 'error'
    })
  ]
})
if (!process.env.NODE_ENV ||  process.env.NODE_ENV === 'development') {
  logger.add(winston.transports.Console)
}

module.exports = {
  logger
}