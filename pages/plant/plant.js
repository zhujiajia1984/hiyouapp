// plant.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMainPage: true,
    photoPath: "",
    plants: [],
    plantName: "",
    isHideLeftImg: false,
    isHideRightImg: false,
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 切换花草显示，修改名称
  changePlant: function (e) {
    // 名称显示
    var index = e.detail.current;
    var plantName = this.data.plants[index].Name;

    // 箭头显示和隐藏
    var isHideLeftImg = false;
    var isHideRightImg = false;
    if (index == (this.data.plants.length - 1)) {
      // 到底部
      var isHideLeftImg = false;
      var isHideRightImg = true;
    } else if (index == 0) {
      // 到头部
      var isHideLeftImg = true;
      var isHideRightImg = false;
    }
    this.setData({ plantName: plantName, isHideLeftImg: isHideLeftImg, isHideRightImg: isHideRightImg })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 拍照并识别花草
  takePicture: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // console.log(res);
        var path = res.tempFiles[0].path;
        var size = res.tempFiles[0].size;
        that.plantRecognize(path, size);
      },
    })

  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 从相册选取图像识别花草
  choosePhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var path = res.tempFiles[0].path;
        var size = res.tempFiles[0].size;
        that.plantRecognize(path, size);
      }
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 显示结果对话框
  showDialog: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        return;
      }
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 识别花草
  plantRecognize: function (path, size) {
    var that = this;
    wx.showLoading({
      title: '识别中...',
    })
    wx.uploadFile({
      // url: 'https://weiquaninfo.cn/plantRecognize',
      url: 'https://hiyoutest.doublecom.net/wxAppToolApi/Distinguish/',
      filePath: path,
      name: 'plantImage',
      formData: {
        'size': size
      },
      success: function (res) {
        var data = res.data;
        data = JSON.parse(data);
        console.log(data);
        switch (data.Status) {
          case 1001:
            wx.hideLoading();
            that.showDialog("提交请求内容中未包含img_base64参数，无法获取图片信息");
            break;
          case 1002:
            wx.hideLoading();
            that.showDialog("img_base64参数的数据不是base64编码，或者数据超过800K");
            break;
          case 1003:
            wx.hideLoading();
            that.showDialog("植物图片识别失败");
            break;
          case 0:
            //业务代码
            var plants = [];
            var plantName = "";
            var isHideLeftImg = false;
            var isHideRightImg = false;
            plants = data.Result;
            if (data.Result.length > 0) {
              plantName = data.Result[0].Name;
            } else {
              // 无数据
              plantName = '无法识别';
            }
            if (data.Result.length == 1) {
              isHideLeftImg = true;
              isHideRightImg = true;
            } else if (data.Result.length > 1) {
              isHideLeftImg = true;
              isHideRightImg = false;
            }
            for (var i = 0; i < plants.length; i++){
              plants[i].Score = (plants[i].Score * 100).toFixed(2) + '%'
              if (plants[i].AliasName.length == 0){
                plants[i].AliasName = '无';
              }
            }
            that.setData({
              isMainPage: false, photoPath: path, plants: plants, plantName: plantName, isHideLeftImg: isHideLeftImg, isHideRightImg: isHideRightImg
            })
            wx.hideLoading();
            break;
          default:
            wx.hideLoading();
            that.showDialog("接口失败");
            break;
        }
      },
      fail: function () {
        that.showDialog("go to fail");
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置bar文字和颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0d932d',
    })
    wx.setNavigationBarTitle({
      title: '花草识别',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})