//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    grids: [{
      title: '购买门票',
      iconPath: '/img/buyTicket.png',
      url:'../ticket/ticket'
    }, {
      title: '花草识别',
      iconPath: '/img/flowerScan.png',
      url: '../plant/plant'
    },
    ]
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    try {
      var res = wx.getStorageInfoSync()
      console.log(res.currentSize)
      that.setData({ currentsize: (res.currentSize / 1024).toFixed(1) })
    } catch (e) {
      // Do something when catch error
    }
  },
  username: function () {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {

          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })
        }
        else {
          if (!res.authSetting["scope.userInfo"]) {
            wx.openSetting({
              success: (res) => {
                app.getUserInfo(function (userInfo) {
                  //更新数据
                  that.setData({
                    userInfo: userInfo
                  })
                })
              }
            })
          }
        }
      }
    })
  },
  location: function () {
    var self = this
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.userLocation"]) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })

  },
  del: function () {
    wx.showToast({
      title: '删除中...',
      icon: 'loading',
      duration: 2000
    })
    try {
      wx.clearStorageSync()

    } catch (e) {
      // Do something when catch error
    }
  },
})
