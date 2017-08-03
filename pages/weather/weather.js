var bmap = require('../../libs/bmap-wx.min.js');
Page({
  data: {
    weatherData: ''
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: "https://hiyoutest.doublecom.net/wxAppToolApi/getweather/",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      data: {
        pk: 13
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return
        } else {
          var weatherData = ''
          weatherData = '实时温度：' + res.data[0].weather.temperature + '°\n' + '天气：' + res.data[0].weather.text + '\n' + '更新时间：' + res.data[1].uptime + '\n';
          that.setData({
            weatherData: weatherData
          });
        }
      }
    })
  }
})