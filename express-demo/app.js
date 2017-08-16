const express = require('express')
const http = require('http')

const app = express()

const server = http.createServer(app)

console.log('listen 3000')
server.listen(3000)

// app.get('/user', [mw1, mw2], function (req, res, next) {
//   console.log('j1')
//   req.query.a += 1
//   next()
// }, function (req, res, next) {
//   console.log('j2')
//   res.send('j2')
// }, function (req, res, next) {
//   console.log('j3')
//   res.send('j3')
// })

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
app.get('/user/:id', [mw1, mw2], function (req, res, next) {
  // 如果 user id 为 0, 跳到下一个路由
  console.log(req.params)
  if (req.params.id == 0) next('route');
  // 否则将控制权交给栈中下一个中间件
  else next(); //
}, function (req, res, next) {
  // 渲染常规页面
  console.log('regular')
  res.send('regular');
});

// 处理 /user/:id， 渲染一个特殊页面
app.get('/user/:id', function (req, res, next) {
  console.log('special')
  res.send('special');
});

function mw1 (req, res, next) {
  console.log('mw1')
  if (req.params.id == 0) next('route')
  else next()
}

function mw2 (req, res, next) {
  console.log('mw2')
  next()
}
