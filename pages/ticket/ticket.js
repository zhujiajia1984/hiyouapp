Page({
  data: {
    background: [{ 'id': 0, 'class': 'demo-text-1', 'price': 0.01, 'img': '../../img/800.png', 'type': '全价票' }, { 'id': 1, 'class': 'demo-text-2', 'price': 0.02, 'img': '../../img/800.png', 'type': '半价票' }, { 'id': 2,'class': 'demo-text-3', 'price': 0.03, 'img': '../../img/800.png', 'type': '参观票' }],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  admission:function(e){
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/ticket/admission/admission?price=' + this.data.background[id].price + '&type=' + this.data.background[id].type
    })
  }
})
