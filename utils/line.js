const app = getApp()

function postLine(data, resolve) {
  app.authRequest({
    method: 'get',
    url: `https://hiyoutest.doublecom.net/line/`,
    data: data || {},
    header: { 'Content-Type': 'application/json' },
    success: resolve,
    fail: function () { }
  })
}

module.exports = {
  postLine(data, resolve) {
    return postLine(data, resolve)
  }
}