var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["收藏景点"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scenic: [],
  },
  onLoad: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex
        });
      }
    });
    var value = wx.getStorageSync('unionid')
    if (value != '') {
      wx.request({
        url: "https://hiyoutest.doublecom.net/wxAppToolApi/Collection/",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        data: {
          Unionid: value,
        },
        complete: function (res) {
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return
          } else {
            var scenic = []
            for (var i = 0; i < res.data.length; i++) {
              var temp = {}
              temp['id'] = res.data[i].id
              temp['name'] = res.data[i].name
              scenic.push(temp)
            }
            self.setData({ scenic: scenic })
          }
        }
      })
    }else{
      wx.login({
        success: function (re) {
          var code = re.code
          wx.request({
            url: "https://hiyoutest.doublecom.net/wxAppToolApi/Collection/",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "GET",
            data: {
              Wxid: code,
            },
            complete: function (res) {
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return
              } else {
                var scenic = []
                for(var i=0;i<res.data.length;i++){
                  var temp = {}
                  temp['id'] = res.data[i].id
                  temp['name'] = res.data[i].name
                  scenic.push(temp)
                }
                self.setData({scenic:scenic})
              }
            }
          })
        }
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});