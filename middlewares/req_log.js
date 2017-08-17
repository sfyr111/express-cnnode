const logger = require('../utils/logger').reqLogger

function logRequests (options) {
  return function (req, res, next) {
    const content = {
      method: req.method,
      originaUrl: req.originaUrl,
      query: req.query,
      body: req.body,
      ip: req.ip || req.ips || req.get('X-Real-Ip'),
      user: req.user || undefined,
      httpStatusCode: res.httpStatusCode
    }
    logger.info('request', content)
    next()
  }
}

module.exports = {
  logRequests
}