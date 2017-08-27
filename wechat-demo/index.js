const APP_ID =  'wx78dfb7976e77c436'
const APP_SECRET = '1a55760202297f214c23a5dd9514646e'
const code = '061gO25t0kg4Wa1rpf3t0AOT4t0gO25a'

// https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code // 网页获取token

// 通过开发工具登录后获得'http://calmyang.top/?code=001OXPyB0cj0Rc2O1CzB0OnVyB0OXPyq&state=STATE'

const accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APP_ID}&secret=${APP_SECRET}&code=${code}&grant_type=authorization_code`

const axios = require('axios')

axios.get(accessTokenUrl)
  .then(r => {
    console.log('---data---')
    console.log(JSON.stringify(r.data))
    console.log('---data---')
  })
  .catch(e => {
    console.log(e)
  })