## 需求
+ 要知道哪一行出错，ERROR的：stack trace
+ 即时告知用户出错
+ 用于接口调试的错误消息，比如错误码

## 实现
+ 继承
```javascript
class BaseHTTPErro extends Error() {
  constructor (msg, CNCode, httpCode, httpMsg) {
    super(msg)
    this.CNCode = CNCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
  }
}
throw new BaseHTTPErro('error', 1001, 500, '服务出错')
```

## express-vaildator
校验
