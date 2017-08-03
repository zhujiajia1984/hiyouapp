const line = require('../../utils/line.js')
Page({
  data: {
    controls: [],
    polyline:[],
    markers: [],
    scenic_lat:'',
    scenic_lng:'',
    isCtlShow: false,
    types: [{
      id: 0,
      name: '全部',
      path: '/img/sci.png',
    }],
    index: 0,
  },
  typeChange(e){
    var self = this
    self.setData({ index: e.detail.value })
    if (e.detail.value=='0'){
      wx.request({
        url: "https://hiyoutest.doublecom.net/wxAppToolApi/getScenicNames",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        data: {
          ScienicID: 13,
          ScienicType: "marker"
        },
        complete: function (res) {
          console.log(res)
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return
          } else {
            self.typeindex(res)
          }
        }
      })
    }else{
      wx.request({
        url: "https://hiyoutest.doublecom.net/wxAppToolApi/getScienicType",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        data: {
          MarkerTypeId: self.data.types[e.detail.value].id,
          ScenicId:13

        },
        complete: function (res) {
          console.log(res)
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return
          } else {
            self.typeindex(res)
          }
        }
      })
    }
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    wx.showActionSheet({
      itemList: ['详情', '导航'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '/pages/video/video?id=' + e.markerId
            })
          }else{
            wx.navigateTo({
              url: '/pages/line/line?id=' + e.markerId
            })
          }
        }
      }
    })
  },
  controltap(e) {
    console.log(e.controlId)
  },
  indexdata(){
    var self = this
    var scenic_lat = ''
    var scenic_lng = ''
    wx.request({
      url: "https://hiyoutest.doublecom.net/wxAppToolApi/getScienicType",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      data: {},
      complete: function (res) {
        console.log(res)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return
        } else {
          var temp = [{
            id: 0,
            name: '全部',
            path: '/img/sci.png',
          }]
          for(var i=0;i<res.data.length;i++){
            var tem = {}
            switch (res.data[i].TypeId) {
              case 16:  //餐饮
                tem.path = "../../img/can1.png";
                break;
              case 17:  //厕所
                tem.path = "../../img/ce1.png";
                break;
              case 19:  //出入口
                tem.path = "../../img/ru1.png";
                break;
              case 18:  //服务中心
                tem.path = "../../img/fu1.png";
                break;
              case 20:  //景点
                tem.path = "../../img/scenic1.png";
                break;
              case 21:  //旅游巴士
                tem.path = "../../img/che1.png";
                break;
              case 22:  //售票点
                tem.path = "../../img/shou1.png";
                break;
              case 23:  //停车场
                tem.path = "../../img/ting1.png";
                break;
              case 24:  //小卖部
                tem.path = "../../img/shang1.png";
                break;
              case 25:  //游乐园
                tem.path = "../../img/you1.png";
                break;
              case 26:  //游轮码头
                tem.path = "../../img/ma1.png";
                break;
              default:
                break;
            }
            tem['name'] = res.data[i].TypeName
            tem['id'] = res.data[i].TypeId
            temp.push(tem)
          }
          self.setData({ types: temp })
        }
      }
    });
    wx.request({
      url: "https://hiyoutest.doublecom.net/wxAppToolApi/getScenicNames",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "GET",
      data: {
        ScienicID: 13,
        ScienicType: "marker"
      },
      complete: function (res) {
        console.log(res)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return
        } else {
          self.typeindex(res)
        }
      }
    })
    var phoneParam = {
      phoneWidth: 0,
      phoneHeight: 0,
    };
    try {
      var sysInfo = wx.getSystemInfoSync();  //获取手机屏幕参数
      phoneParam.phoneWidth = sysInfo.windowWidth;
      phoneParam.phoneHeight = sysInfo.windowHeight;
      console.log(phoneParam);
    } catch (e) {
      console.log("getSystemInfoSync failed");
      return;
    }
    var controls = [];
    var leftPos = ((phoneParam.phoneWidth - 200) / 2 - 40) / 2;  // 自己定位图标,中间留200
    var space = leftPos;
    var topPos = (phoneParam.phoneHeight - space * 2 - 40 * 2);
    var ctlPos = {
      id: 1,
      iconPath: '/img/gps.png',
      position: {
        left: leftPos,
        top: topPos,
        width: 40,
        height: 40,
      },
      clickable: true
    };
    controls.push(ctlPos);
    topPos = (phoneParam.phoneHeight - space - 40);     // 景区定位图标
    var ctlPos2 = {
      id: 2,
      iconPath: '/img/sPos.png',
      position: {
        left: leftPos,
        top: topPos,
        width: 40,
        height: 40,
      },
      clickable: true
    };
    controls.push(ctlPos2);
    topPos = (phoneParam.phoneHeight - space - 40 - 10);    //二维码图标
    leftPos = (phoneParam.phoneWidth - 172) / 2
    var ctlPos3 = {
      id: 3,
      iconPath: '/img/scan.png',
      position: {
        left: leftPos,
        top: topPos,
        width: 172,
        height: 60,
      },
      clickable: true
    };
    controls.push(ctlPos3);
    leftPos = phoneParam.phoneWidth - space - 40;
    topPos = (phoneParam.phoneHeight - space * 2 - 40 * 2);
    var ctlPos4 = {
      id: 4,
      iconPath: '/img/refresh.png',
      position: {
        left: leftPos,
        top: topPos,
        width: 40,
        height: 40,
      },
      clickable: true
    };
    controls.push(ctlPos4);

    // 景点类型选择图标
    var leftDis = (phoneParam.phoneWidth - space - 40) + 'px';
    var topDis = (phoneParam.phoneHeight - space - 40) + 'px';

    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.hideLoading()
        self.setData({ latitude: res.latitude })
        self.setData({ longitude: res.longitude })
        self.setData({ controls: controls, leftDis: leftDis, topDis: topDis, isCtlShow: true })

      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          confirmText: '我知道了',
          showCancel: false,
          content: '定位失败,你将无法正常使用,请在"我的"页面中去授权!',
          success: function (res) {

          }
        })
      }
    });
    var polylin = [{
      points: [],
      color: "#0091ff",
      width: 6,
      arrowLine: true,
      borderColor: "blue",
      borderWidth: 1
    }]
    line.postLine({}, function (result) {
      var lng = result.data.latitude
      for (var i = 0; i < lng.length; i++) {
        var temp = {}
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        var x = lng[i].lng - 0.0065
        var y = lng[i].lat - 0.006
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
        var lngg = z * Math.cos(theta)
        var latt = z * Math.sin(theta)
        temp['longitude'] = lngg
        temp['latitude'] = latt
        polylin[0].points.push(temp)
      }
      self.setData({ polyline: polylin })
      console.log(self.data.polyline)
    })
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
          self.setData({ temperature:res.data[0].weather.temperature+'°'})
        }
      }
    })
  },
  onLoad: function () {
    this.indexdata()
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  onShow: function () {
    // wx.onAccelerometerChange(function (e) {
    //   if (e.x > 0.5 && e.y > 0.5) {
    //     wx.showToast({
    //       title: '摇一摇成功',
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   }
    // })
  },
  getCenterLocation: function (e) {
    if (e.controlId==1){
      this.mapCtx.moveToLocation()
    }
    if(e.controlId==3){
      wx.scanCode({
        success: (res) => {
          console.log(res)
          if (res.result.split('/')[2]=="hiyoutest.doublecom.net"){
            var result = res.result.split('?');
            var url = '/pages/video/video?' + result[1];
            wx.navigateTo({
              url: url
            })

          }else{
            wx.showToast({
              title: '非官方二维码',
              content: '非官方二维码',
              showCancel: false
            })
          }
        }
      })
    }
    if (e.controlId == 2) {
      var self = this
      if(!self.data.scenic_lat){
        wx.showToast({
          title: '景区无景点、无法定位!',
          content: '景区无景点、无法定位!',
          showCancel: false
        })
      }
      self.setData({ latitude: self.data.scenic_lat, longitude: self.data.scenic_lng })
    }
    if(e.controlId == 4 ){
      this.setData({ index:0 })
      this.indexdata()

    }
  },
  weather(){
    wx.navigateTo({
      url: '/pages/weather/weather'
    })
  },
  typeindex(res){
    var self =this
    var data = res.data
    var mark = []
    for (var i = 0; i < data.length; i++) {
      var temp = {}
      temp['id'] = data[i].MarkerId
      switch (data[i].MarkerTypeId) {
        case 16:  //餐饮
          temp.iconPath = "../../img/can1.png";
          break;
        case 17:  //厕所
          temp.iconPath = "../../img/ce1.png";
          break;
        case 19:  //出入口
          temp.iconPath = "../../img/ru1.png";
          break;
        case 18:  //服务中心
          temp.iconPath = "../../img/fu1.png";
          break;
        case 20:  //景点
          temp.iconPath = "../../img/scenic1.png";
          break;
        case 21:  //旅游巴士
          temp.iconPath = "../../img/che1.png";
          break;
        case 22:  //售票点
          temp.iconPath = "../../img/shou1.png";
          break;
        case 23:  //停车场
          temp.iconPath = "../../img/ting1.png";
          break;
        case 24:  //小卖部
          temp.iconPath = "../../img/shang1.png";
          break;
        case 25:  //游乐园
          temp.iconPath = "../../img/you1.png";
          break;
        case 26:  //游轮码头
          temp.iconPath = "../../img/ma1.png";
          break;
        default:
          break;
      }
      var callout = {};
      callout.bgColor = "#000000";
      callout.color = "#FFFFFF";  //气泡文字颜色白色
      callout.fontSize = 15;      //气泡文字大小
      callout.borderRadius = 5;   // 圆角
      callout.padding = 5;        // 边缘间距
      callout.content = data[i].MarkerName + " >";// 内容
      temp.callout = callout;
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var x = data[i].MarkerLng - 0.0065
      var y = data[i].MarkerLat - 0.006
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
      var lngg = z * Math.cos(theta)
      var latt = z * Math.sin(theta)
      temp['latitude'] = latt
      temp['longitude'] = lngg
      temp['width'] = 30
      temp['height'] = 30
      mark.push(temp)
      self.setData({ scenic_lat: latt, scenic_lng: lngg })
    }
    self.setData({ markers: mark })
  }
})
