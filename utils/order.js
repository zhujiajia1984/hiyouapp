const app = getApp()

function postBilling (data, resolve) {
  app.authRequest({
    method: 'get',
    url: `https://hiyoutest.doublecom.net/pay/`,
    data: data || {},
    header: { 'Content-Type': 'application/json'},
    success: resolve,
    fail: function(){}
  })
}

module.exports = {
  postBilling (data, resolve) {
    return postBilling(data, resolve)
  }
}