class BaseHTTPError extends Error {
  constructor (msg, CNCode, httpCode, httpMsg) {
    super(msg)
    this.CNCode = CNCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'BaseError'
  }

  static get['DEFAULT_CNCODE'] () {
    return 100000
  }
}
// throw new BaseHTTPError('some error with server', 1001, 500, '服务出错')

class InternalError extends BaseHTTPError {
  constructor (msg) {
    const CNCode = 100001
    const httpMsg = '服务器出了一些小问题'
    super(msg, CNCode, 500, httpMsg)
    this.name = 'InternalError'
  }
}

class ValidateionError extends BaseHTTPError {
  constructor (path, reason) {
    const CNCode = 200000
    const httpCode = 400
    super(`error validating param, path: ${path}, reason: ${reason}`, CNCode, httpCode, '参数错误')
    this.name = 'ValidateionError'
  }
}

class DuplicatedUserNameError extends BaseHTTPError {
  constructor (username) {
    const CNCode = 200001
    const httpCode = 400
    const httpMsg = '用户名重复'
    super('username', CNCode, httpCode, `duplicate username: ${username}`)
    this.name = 'DuplicatedUserNameError'
  }
}

class WechatAPIError extends BaseHTTPError {
  constructor (msg) {
    super(`wechat api error: ${msg}`, 300001, 500, '微信服务调用失败')
  }
}

class RedisError extends BaseHTTPError {
  constructor (msg) {
    super(`redis error: ${msg}`, 300001, 500, '服务器内部异常')
  }
}

module.exports = {
  RedisError,
  BaseHTTPError,
  InternalError,
  WechatAPIError,
  ValidateionError,
  DuplicatedUserNameError
}
