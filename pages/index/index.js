//index.js
//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie.js')
const authUrl = app.globalData.serverUrl + app.globalData.apiVersion

Page({
  data: {
    isLogin: false,
    weatherData: null,
    stockData: null,
    constellationData: null
  },

  //事件处理函数
  bindViewTap: function () {
  },

  // 更新数据
  updateData: function () {
    wx.showLoading({
      title: '下载中',
    })
    var that = this
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    // 请求天气数据
    wx.request({
      url: authUrl + '/service/weather',
      method: "GET",
      header: header,
      success: function (res) {
        that.setData({
          weatherData: res.data.data
        })
        wx.hideLoading()
      }
    })
    //请求股票
    wx.request({
      url: authUrl + '/service/stock',
      method: "GET",
      header: header,
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          stockData: res.data.data
        })
        wx.hideLoading()
      }
    })
    //请求星座
    wx.request({
      url: authUrl + '/service/constellation',
      method: "GET",
      header: header,
      success: function (res) {
        console.log("星座" + res.data.data)
        that.setData({
          constellationData: res.data.data
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    wx.request({
      url: authUrl + '/auth/status',
      method: "GET",
      header: header,
      success: function (res) {
        var status = res.data.data.is_authorized
        if (status == 1) {
          console.log("登陆状态")
          that.setData({
            isLogin: true
          })
          that.updateData()
        } else {
          console.log("sessio过期")
          that.setData({
            isLogin: false
          })
        }
      }
    })
    this.updateData()
  },


  onLoad: function () {

  }


})
