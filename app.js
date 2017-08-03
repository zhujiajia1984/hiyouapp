//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (re) {
          that.globalData.code = re.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },

  authRequest: function (obj) {
    var that = this
    //if (!that.globalData.token) {
     // var token = wx.getStorageSync('userToken')
      //console.log('111111111111111111111111111111',token)
     // if (!token) {
      //  wx.hideToast()
      //  wx.showModal({
       //   title: '未登录',
        //  content: '请前往 “我的”登陆',
         // showCancel: false,
         // success: function (res) {
            // 清除没用的token
          //  wx.removeStorage({ key: 'userToken' })
           // that.globalData.token = undefined
            //if (getCurrentPages().length > 1) {
            //  wx.navigateBack()
           // }
         // }
       // })
       // return
     // }
     // that.globalData.token = token
     // that.request({
      //  url: `${that.globalData.API_URL}/sessions/login`,
       // method: 'POST',
        //data: { code: that.globalData.code },
        //success: function (res) {
          //if (!res.data.token) {
            //wx.hideToast()
            //wx.showModal({
            //  title: '未登录',
             // content: '请前往 “我的” 页面绑定手机号',
             // showCancel: false,
             // success: function (res) {
                // 清除没用的token
             //   wx.removeStorage({ key: 'userToken' })
              //  that.globalData.token = undefined
              //  if (getCurrentPages().length > 1) {
               //   wx.navigateBack()
               // }
             // }
            //})
         // } else {
           // that.globalData.currentCustomer = res.data.customer
           // that.globalData.token = res.data.token
           // wx.setStorage({
            //  key: 'userToken',
            //  data: res.data.token
           // })
          //  that.request(obj)
         // }
        //},
       // fail: function (res) { }
     // })
   // } else {
      wx.request(obj)
    //}
  },
})