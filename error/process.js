process.on('uncaughtException', e => {
  console.log(e)
  process.exit(1)
}) // 进程崩溃 - 内存问题等 - 需要退出

process.on('unhandledRejection', (reason, p) => {
  console.log(p)
  console.log(reason)
})

new Promise((resolve, reject) => {
  throw new Error('wrong!') // 可以在reason内打印行数
  // reject('wrong!') // 不能打印行数
})

