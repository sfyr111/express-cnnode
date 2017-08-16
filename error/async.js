async function foo () {
  throw new Error('error in foo')
}

;(async () => {
  await foo()
})()
  .then(r => {
    // console.log(r)
  })
  .catch(e => {
    console.log(e)
  })
