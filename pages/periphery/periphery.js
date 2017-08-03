var bmap = require('../../libs/bmap-wx.min.js');
var wxMarkerData = [];
Page({
  data: {
    address: '',
    icon:'',
    grids: [{ 'id': 1, 'img': '../../img/shang.png','name':'小卖部' }, { 'id':2, 'img': '../../img/che.png','name':'旅游车' },
      { 'id': 3, 'img': '../../img/you.png','name':'游乐园' }, { 'id': 4, 'img': '../../img/zi.png' ,'name':'自行车'},
      { 'id': 5, 'img': '../../img/ma.png','name':'游轮码头' }, { 'id': 6, 'img': '../../img/scenic.png','name':'景点' },
      { 'id': 6, 'img': '../../img/can.png', 'name': '餐饮' }],
    grid: [{ 'id': 1, 'img': '../../img/ru.png', 'name': '园区入口' }, { 'id': 2, 'img': '../../img/fu.png', 'name': '服务中心' },
      { 'id': 3, 'img': '../../img/shou.png', 'name': '售票厅' }, { 'id': 4, 'img': '../../img/ting.png', 'name': '停车场' },
      { 'id': 5, 'img': '../../img/ce.png', 'name': '厕所' }, { 'id': 6, 'img': '../../img/jd.png', 'name': '酒店' }]
  },
  
  onLoad: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'MPF3wnvCahY4xvvwyhZiSUGYsF0RupfG'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      that.setData({ address: data.wxMarkerData[0].address})
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  }
})
