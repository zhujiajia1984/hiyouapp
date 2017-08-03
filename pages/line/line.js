var amapFile = require('../../libs/amap-wx.js');
Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    polyline: []
  },
  onLoad: function (options) {
    var that = this;
    var latitudd = ''
    var longitudd = ''
    wx.request({
      url: "https://hiyoutest.doublecom.net/wxAppToolApi/searchPoint/",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      data: {
        MarkerId: options.id,
      },
      complete: function (res) {
        console.log(res)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return
        } else {
          wx.setNavigationBarTitle({ title: res.data[0].MarkerName })
          var t = [{
            iconPath: "../../img/zhong.png",
            id: 0,
            latitude: '',
            longitude: '',
            width: 30,
            height: 30
          }]
          var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
          var x = res.data[0].MarkerLng - 0.0065
          var y = res.data[0].MarkerLat - 0.006
          var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
          var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
          var lngg = z * Math.cos(theta)
          var latt = z * Math.sin(theta)
          t[0].latitude = latt
          t[0].longitude = lngg
          latitudd = latt
          longitudd = lngg
          that.setData({ markers: t })




          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              that.setData({ latitude: res.latitude })
              that.setData({ longitude: res.longitude })
              var myAmapFun = new amapFile.AMapWX({ key: '9aedf14575959c769cfe575294573062' });
              console.log(longitudd + ',' + latitudd)
              myAmapFun.getWalkingRoute({
                origin: res.longitude + ',' + res.latitude,
                destination: longitudd + ',' + latitudd,
                success: function (data) {
                  var points = [];
                  if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                      var poLen = steps[i].polyline.split(';');
                      for (var j = 0; j < poLen.length; j++) {
                        points.push({
                          longitude: parseFloat(poLen[j].split(',')[0]),
                          latitude: parseFloat(poLen[j].split(',')[1])
                        })
                      }
                    }
                  }
                  that.setData({
                    polyline: [{
                      points: points,
                      color: "#0091ff",
                      arrowLine: true,
                      width: 6
                    }]
                  });
                  if (data.paths[0] && data.paths[0].distance) {
                    console.log(data.paths[0].distance)
                    that.setData({
                      distance: data.paths[0].distance + '米'
                    });
                  }
                },
                fail: function (info) {

                }
              })
            }
          })

        }
      }
    })


  },
  getCenterLocation: function (e) {
    if (e.controlId == 1) {
      this.mapCtx.moveToLocation()
    }
  }
})