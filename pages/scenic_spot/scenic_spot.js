Page({
  data: {
    controls: [],
    markers: []
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.name })
    var self = this
    wx.getSystemInfo({
      success: function (res) {
        var controls = [
          {
            id: 1,
            iconPath: '../../img/gps.png',
            position: {
              left: 30,
              top:0,
              width: 30,
              height: 30
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '../../img/wf.png',
            position: {
              left: 30,
              top: 0,
              width: 30,
              height: 30
            },
            clickable: true
          }
        ]
        controls[0].position.top = res.windowHeight - 110
        controls[1].position.top = res.windowHeight - 150
        self.setData({ controls: controls })
        self.setData({ name: options.name })
        var temp = [{
          iconPath: "/resources/others.png",
          id: 0,
          latitude: 23.099994,
          longitude: 113.324520,
          width: 30,
          height: 30
        }]
        temp[0].iconPath=options.img
        temp[0].id = options.id
        temp[0].latitude = options.latitude
        temp[0].longitude = options.longitude
        self.setData({ markers: temp })
        self.setData({ latitud: options.latitude })
        self.setData({ longitud: options.longitude })

      }
    })
    self.setData({id: options.id})
    self.setData({ name: options.name })
    self.setData({ img: options.img })
    console.log(options.id) 
    wx.showLoading({
      title: '定位中...',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.hideLoading()
        self.setData({ latitude: res.latitude })
        self.setData({ longitude: res.longitude })
        //var speed = res.speed
        //var accuracy = res.accuracy
      },
      fail:function(){
        wx.hideLoading()
      }
    })
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  getCenterLocation: function (e) {
    if (e.controlId == 1) {
      this.mapCtx.moveToLocation()
    } else {
      wx.getNetworkType({
        success: function (res) {
          var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi, none, unknown
          wx.navigateTo({
            url: '/pages/wifi/wifi?wf=' + networkType
          })
        }
      })
    }
  },
})

