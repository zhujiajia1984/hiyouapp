Page({
  data: {
    controls: [],
    markers: [],
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    wx.navigateTo({
      url: '/pages/scenic_spot/scenic_spot?img=' + this.data.markers[e.markerId]['iconPath'] + '&latitude=' + this.data.markers[e.markerId]['latitude'] + '&longitude=' + this.data.markers[e.markerId]['longitude'] + '&id=' + e.markerId+'&name='+this.data.name
    })
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function (re) {
    var self = this
    var controls = [
      {
        id: 1,
        iconPath: '../../img/gps.png',
        position: {
          left: 30,
          top: 0,
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
    wx.getSystemInfo({
      success: function (res) {
        controls[0].position.top = res.windowHeight - 60
        controls[1].position.top = res.windowHeight - 100
        self.setData({ controls: controls })
      }
    });
    wx.setNavigationBarTitle({ title: re.name })
    var mark = []
    wx.showLoading({
      title: '定位中...',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.hideLoading()
        self.setData({ latitude: res.latitude })
        self.setData({ longitude: res.longitude })
        for (var i = 0; i < 6; i++) {
          var temp = {}
          temp['id'] = i
          temp['iconPath'] = '../../img/'+re.img.split('/').pop().split('.')[0]+'1.png'
          temp['latitude'] = res.latitude + Math.random()/260
          temp['longitude'] = res.longitude + Math.random()/260
          temp['width'] = 30
          temp['height'] = 30
          mark.push(temp)
        }
        self.setData({ markers: mark })
        self.setData({ name: re.name })
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
