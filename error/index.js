class BaseHTTPError extends Error {
  constructor (msg, CNCode, httpCode, httpMsg) {
    super(msg)
    this.CNCode = CNCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
  }
}
// throw new BaseHTTPError('some error with server', 1001, 500, '服务出错')

class ValidateionError extends BaseHTTPError {
  constructor (path, reason) {
    const CNCode = 1001
    const httpCode = 400
    super(`error validating param, path: ${path}, reason: ${reason}`, CNCode, httpCode, '参数错误')
  }
}

module.exports = {
  BaseHTTPError,
  ValidateionError
}