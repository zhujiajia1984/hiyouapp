const backgroundAudioManager = wx.getBackgroundAudioManager();  // 背景音频管理控件
var timer = 0;
var app = getApp()                                                  // 定时器
Page({
  data: {
    map: '',
    poster: '',
    name: '',
    src: '',
    totalTime: '0.00',
    curTime: '0.00',
    curPercent: 0,
    sysWidth: 0,
    playPos:{
      leftPos: '',
      topPos: '',
    },
    isPause: true,
    isFirst: true,  //是否第一次播放
    isHideTime: true,
    markerId: 0,
    isNotFavour: true,
    contents:{
      type: "",
      isText: "",
      src:"",
      content:"",
    },    // 内容
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击收藏景点按钮事件
  clickFavour:function(){
    var self = this 
      wx.login({
        success: function (re) {
          var code = re.code
          wx.getUserInfo({
            success: function (res) {
              wx.request({
                url: "https://hiyoutest.doublecom.net/wxAppToolApi/Wxusername/",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                  MarkerId: self.data.id,
                  Wxid: code,
                  encryptedData:res.encryptedData,
                  signature: res.signature,
                  iv:res.iv
                },
                complete: function (res) {
                  if (res == null || res.data == null) {
                    console.error('网络请求失败');
                    return
                  } else {
                    if(res.data[0].text=='yes'){
                      try {
                        wx.setStorageSync('unionid', res.data[0].unionid)
                      } catch (e) {
                      }
                      if(res.data[0].sign==0){
                        self.setData({ isNotFavour: false });
                        wx.showToast({
                          title: '收藏成功!',
                          content: '收藏成功!',
                          showCancel: false
                        })
                      }else{
                        self.setData({ isNotFavour:true });
                        wx.showToast({
                          title: '取消收藏成功!',
                          content: '取消收藏成功!',
                          showCancel: false
                        })
                      }
                    }else{
                      wx.showToast({
                        title: '操作失败!',
                        content: '操作失败!',
                        showCancel: false
                      })
                    }
                  }
                }
              })
            }
            })
        }
      })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 初始化背景音乐
  initBgAudio: function (src, name, img) {
    var that = this;
    // 有音频路径
    if (!src) {
    } else {

      // 监听播放事件，获取当前时间点并显示
      backgroundAudioManager.onPlay(function () {
        // 循环更新进度条
        timer = setInterval(function () {
          var curTime = parseInt(backgroundAudioManager.currentTime);
          var totalTime = parseInt(backgroundAudioManager.duration);
          var curPercent = Math.round(curTime * 100 / totalTime);
          that.setData({ curTime: that.secToMin(curTime), totalTime: that.secToMin(totalTime), curPercent: curPercent});
        }, 500)
      })
      // 监听暂停事件，取消定时器
      backgroundAudioManager.onPause(function () {
        clearInterval(timer);
      })
      // 监听停止事件，取消定时器并重置当前时间
      backgroundAudioManager.onStop(function () {
        clearInterval(timer);
        that.setData({ curTime: 0, isFirst: true });
      })
      // 监听自然结束事件，取消定时器并重置当前时间
      backgroundAudioManager.onEnded(function () {
        clearInterval(timer);
        backgroundAudioManager.stop();
        that.setData({ isPause: true, isFirst: true });
      })
      // 数据不足
      backgroundAudioManager.onWaiting(function () {
        console.log("数据不足")
      })
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 秒数转分钟秒格式
  secToMin:function(t){
    return Math.floor(t / 60) + ":" + (t % 60 / 100).toFixed(2).slice(-2);
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 开始播放背景音乐
  playBgAudio: function () {
    if (this.data.isFirst) {
      // 初始化参数
      backgroundAudioManager.title = this.data.name;
      backgroundAudioManager.epname = this.data.name;
      backgroundAudioManager.singer = 'Hi游';
      backgroundAudioManager.webUrl = this.data.src;
      backgroundAudioManager.coverImgUrl = this.data.poster;
      backgroundAudioManager.src = this.data.src;
    } else {
      backgroundAudioManager.play();
    }
    this.setData({ isPause: false, isFirst: false, isHideTime: false});
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 暂停播放背景音乐
  pauseBgAudio: function () {
    backgroundAudioManager.pause();
    this.setData({ isPause: true });
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OnLoad
  onLoad: function (options) {
    var contents = [];
    var self = this
    self.setData({ id: options.id  });
      var value = wx.getStorageSync('unionid')
      if (value!='') {
        // Do something with return value
        wx.request({
          url: "https://hiyoutest.doublecom.net/wxAppToolApi/searchPoint/",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "GET",
          data: {
            MarkerId: options.id,
            Unionid:value
          },
          complete: function (res) {
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return
            } else {
              if (!res.data[0]['MarkerImg']) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              } else {
                // 初始化播放按钮图片位置
                var sysInfo = wx.getSystemInfoSync();  //获取手机屏幕参数
                var playPos = {};

                playPos.leftPos = ((sysInfo.windowWidth - 60) / 2) + 'px';
                playPos.topPos = ((200 - 60) / 2) + 'px';

                // 初始化背景音频
                self.initBgAudio(res.data[0].MarkerVideo, res.data[0].MarkerName, res.data[0].MarkerImg);

                // 解析html标签
                wx.request({
                  url: 'https://weiquaninfo.cn/htmlParse/wxApp',
                  data: {
                    html: res.data[0].MarkerText,
                  },
                  method: "POST",
                  success:function(res){
                    contents = res.data;
                    for (var i = 0; i < contents.length; i++){
                      if (contents[i].type == "img"){
                        contents[i].isText = false;
                        contents[i].src = "https://hiyoutest.doublecom.net" + contents[i].src;
                      }else{
                        contents[i].isText = true;
                      }
                    }
                    self.setData({ contents: contents });
                  }
                })
                // 
                var reg = /<[^<>]+>/g;
                wx.setNavigationBarTitle({ title: res.data[0].MarkerName })
                self.setData({
                  map: res.data[0].MarkerImg, poster: res.data[0].MarkerImg,
                  name: res.data[0].MarkerName, src: res.data[0].MarkerVideo, text: res.data[0].MarkerText.replace(reg, ''),
                  playPos: playPos, markerId: options.id
                })
                if(!!res.data[0]['unionid']){
                  self.setData({isNotFavour:false})
                }
              }
            }
          }
        });
      }
    else{
      wx.login({
        success: function (re) {
          var code = re.code
          wx.getUserInfo({
            success: function (res) {
      wx.request({
        url: "https://hiyoutest.doublecom.net/wxAppToolApi/searchPoint/",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "GET",
        data: {
          MarkerId: options.id,
          Wxid: code,
        },
        complete: function (res) {
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return
          } else {
            if (!res.data[0]['MarkerImg']) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              // 初始化播放按钮图片位置
              var sysInfo = wx.getSystemInfoSync();  //获取手机屏幕参数
              var playPos = {};

              playPos.leftPos = ((sysInfo.windowWidth - 60) / 2) + 'px';
              playPos.topPos = ((200 - 60) / 2) + 'px';

              // 初始化背景音频
              self.initBgAudio(res.data[0].MarkerVideo, res.data[0].MarkerName, res.data[0].MarkerImg);

              // 解析html标签
              wx.request({
                url: 'https://weiquaninfo.cn/htmlParse/wxApp',
                data: {
                  html: res.data[0].MarkerText,
                },
                method: "POST",
                success: function (res) {
                  contents = res.data;
                  for (var i = 0; i < contents.length; i++) {
                    if (contents[i].type == "img") {
                      contents[i].isText = false;
                      contents[i].src = "https://hiyoutest.doublecom.net" + contents[i].src;
                    } else {
                      contents[i].isText = true;
                    }
                  }
                  self.setData({ contents: contents });
                }
              })
              // 
              var reg = /<[^<>]+>/g;
              wx.setNavigationBarTitle({ title: res.data[0].MarkerName })
              self.setData({
                map: res.data[0].MarkerImg, poster: res.data[0].MarkerImg,
                name: res.data[0].MarkerName, src: res.data[0].MarkerVideo, text: res.data[0].MarkerText.replace(reg, ''),
                playPos: playPos, markerId: options.id
              })
              if (!!res.data[0]['unionid']) {
                self.setData({ isNotFavour: false })
              }
            }
          }
        }
      });

            }
          })
        }
      })
    }
  },

  navigation(){
    wx.navigateTo({
      url: '/pages/line/line?id=' + this.data.id
    })
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // OnUnload
  onUnload: function () {
    backgroundAudioManager.stop();
  },

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 分享
  onShareAppMessage: function (res) {
    var title = "Hi游" + this.data.name;
    var path = "/pages/video/video?id=" + this.data.markerId;
    return {
      title: title,
      path: path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})