const APP_ID =  'wx78dfb7976e77c436'
const APP_SECRET = '1a55760202297f214c23a5dd9514646e'
const axios = require('axios')
const Errors = require('../error')
const redis = require('./redis_service')
const WECHAT_USER_ACCESS_TOKEN_BY_CODE_PREF = 'wechat_user_access_token_by_code:'
const WECHAT_USER_RFRESH_TOKEN_BY_CODE_PREF = 'wechat_user_refresh_token_by_code:'

const getAccessTokenByCode = async function (code) {
  if (!code) throw new Errors.ValidateionError('code', 'code can not be empty')

  let tokenObj = await getAccessTokenFromCache()

  if (!tokenObj) {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`
    tokenObj = await axios.get(url)
      .then(r => {
        if (!r || !r.data) throw new Errors.WechatAPIError('invalid wechat api response')
        return r.data
      })
  }
  await saveUserAccessToken(code, tokenObj)
  if (tokenObj.refresh_token) {
    await saveRefreshToken(code, tokenObj)
  }
  return tokenObj
}

const saveRefreshToken = async function (code, tokenObj) {
  if (!code) throw new Errors.ValidateionError('code', 'code can not be empty')
  if (!tokenObj || !tokenObj.refresh_token) throw new Errors.ValidateionError('access_token_obj', 'refresh_token can not be empty')
  await redis.set(WECHAT_USER_RFRESH_TOKEN_BY_CODE_PREF + code, tokenObj.refreshToken)
    .catch(e => {
      throw new Errors.RedisError(`setting wechat user refresh token failed cause: ${e.message}`)
    })
  await redis.expire(WECHAT_USER_RFRESH_TOKEN_BY_CODE_PREF + code, 28 * 24 * 60 * 60)
      .catch(e => {
        throw new Errors.RedisError(`expiring wechat user refresh token failed cause: ${e.message}`)
      })
}

const refreshAccessToken = async function (refreshToken) {
  const url = `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${APP_ID}&grant_type=refresh_token&refresh_token=${refreshToken}`
  axios.get(url)

  const tokenObj = await axios.get(url)
  .then(r => {
    if (!r || !r.data) throw new Errors.WechatAPIError('refresh wechat api response')
    return r.data
  })
  return tokenObj
}

const saveUserAccessToken = async function (code, tokenObj) {
  if (!code) throw new Errors.ValidateionError('code', 'code can not be empty')

  if (!tokenObj || !tokenObj.access_token) throw new Errors.ValidateionError('access_token', 'access_token can not be empty')
  await redis.set(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PREF + code, tokenObj.access_token)
    .catch(e => {
      throw new Errors.RedisError(`setting wechat user access token failed cause: ${e.message}`)
    })
  await redis.expire(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PREF + code, 7000)
      .catch(e => {
        throw new Errors.RedisError(`expiring wechat user access token failed cause: ${e.message}`)
      })
}

const getAccessTokenFromCache = async function (code) {
  let accessToken = await redis.get(WECHAT_USER_ACCESS_TOKEN_BY_CODE_PREF + code)
    .catch(e => {
      throw new Errors.RedisError(`getting wechat user access token failed cause: ${e.message}`)
    })

    let refreshToken = null
    if (!accessToken) {
      refreshToken = await redis.get(WECHAT_USER_RFRESH_TOKEN_BY_CODE_PREF + code)
        .catch(e => {
          throw new Errors.RedisError(`getting wechat user refresh token failed cause: ${e.message}`)
        })  
    
      if (!refreshToken) return null
      else {
        const tokenObj = await refreshAccessToken(code)
        return tokenObj
      }
    }

  return {
    refresh_token: refreshToken,
    access_token: accessToken
  }
}

const getUserInfoByAccessToken = async function (openId, accessToken) {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN `
  const user = await axios.get(url)
    .then(r => {
      if (!r || !r.data) throw new Errors.WechatAPIError('invalid wechat api response')
      return r.data
    })
  return user
}

const getUserInfoByCode = async function (code) {
  const tokenObj = await getAccessTokenByCode(code)
  const user = await getUserInfoByAccessToken(tokenObj.openid, tokenObj.access_token)
  return user
}

module.exports = {
  getUserInfoByCode,
  getAccessTokenByCode
}
