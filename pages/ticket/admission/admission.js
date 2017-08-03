// pages/ticket/admission/admission.js
const order = require('../../../utils/order.js')
const pay = require('../../../utils/pay.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount:0,
    quantity:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    self.setData({ typee: options.type })
    self.setData({ price: options.price })
    self.setData({ amount: options.price })
    wx.login({
      success: function (re) {
        self.setData({ code: re.code })
      }
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
  bindBilling: function () {
    if (this.data.amount==0){
      wx.showToast({
        title: '没有购选票数',
        content: '没有购选票数',
        showCancel: false
      })
      return 
    }
    var params = {}
    var that = this
    params.code = that.data.code
    params.amount = this.data.amount
    order.postBilling(params, function (result) {
      pay.pay(result.data, function () {
        wx.removeStorage({
          key: 'cartItems',
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: '你已成功购买，如需查看我的收藏，可下载 APP',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    cartItems: [],
                    coupon: ''
                  })
                  that.changeCartAmount()
                }
              }
            })
          }
        })
      })
    })
  },

  onShareAppMessage: function () {
  
  },
  changeCartAmount: function () {
    var amount = 0
    amount += this.data.quantity * this.data.price
    this.setData({ amount: amount })
  },

  addQuantity: function (e) {
    this.changeCartItemQuantity('+', e)
  },

  minusQuantity: function (e) {
    this.changeCartItemQuantity('-', e)
  },

  changeCartItemQuantity: function (op, e) {
    var quantity = this.data.quantity 
    if (op === '-' && this.data.quantity > 1) {
        quantity -= 1
    } else if (op === '+') {
      quantity += 1
    }
    this.setData({ quantity: quantity })
    this.changeCartAmount()
  },
  bindChangeQuantity: function (e) {
    var quantity=0
    if (e.detail.value === "") { return "" }
    if (e.detail.value >= 1) {
      quantity = parseInt(e.detail.value)
    } else {
      quantity = 1
    }
    this.setData({ quantity: quantity })
    this.changeCartAmount()
  },
})