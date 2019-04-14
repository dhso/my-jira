// eslint-disable-next-line no-extend-native
Promise.prototype.done = function(onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected).catch(function(reason) {
    setTimeout(() => {
      throw reason
    }, 0)
  })
}

// eslint-disable-next-line no-extend-native
Promise.prototype.finally = function(callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}
