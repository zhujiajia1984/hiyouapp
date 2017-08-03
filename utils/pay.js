function pay(hash, successCallback) {
  wx.requestPayment({
    'appId': hash.appId,
    'timeStamp': hash.timeStamp,
    'nonceStr': hash.nonceStr,
    'package':   hash.package,
    'signType':  'MD5',
    'paySign': hash.paySign,
    'success': successCallback,
    'fail': function(res){
    }
  })
}
module.exports = {
  pay (hash, successCallback) {
    return pay(hash, successCallback)
  }
}
