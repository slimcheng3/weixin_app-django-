// pages/homepage/homepage.js
var cookieMethod = require('../../utils/cookie.js')
const app = getApp()
const authUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/auth'
var cookieUtil = require('../../utils/cookie.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: null,
    hasUserInfo: null,
    userInfo: null
  },

  //授权登陆
  authorize: function () {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code
        var appId = app.globalData.appId
        var nickName = app.globalData.userInfo.nickName
        wx.request({
          url: authUrl + '/authorize',
          method: "POST",
          data: {
            code: code,
            appId: appId,
            nickName: nickName
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res){
            wx.showToast({
              title: '授权成功',
            })
            var cookie = cookieUtil.getSessionIDFromResponse(res)
            cookieUtil.setCookieToStorage(cookie)
            that.setData({
              isLogin: true,
              hasUserInfo: true,
              userInfo: app.globalData.userInfo
            })
            app.setAuthStatus(true)
          }
        }
        )
      }
    })
  },

  // 注销
  logout:function() {
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    var that = this
    header.cookie = cookie
    wx.request({
      url: authUrl + '/logout',
      method: "GET",
      header: header,
      success:function() {
        wx.showToast({
          title: '注销成功',
        })
        cookieUtil.setCookieToStorage("")
        that.setData({
          isLogin: false,
          hasUserInfo: false,
          userInfo: null
        })
        app.setAuthStatus(false)
      }
    })
  },

  // 获取状态
  getStatusFromRemote:function() {
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    wx.request({
      url: authUrl + '/status',
      method: "GET",
      header: header,
      success: function(res) {
        var status = res.data.data.is_authorized
        if (status == 1) {
          console.log("登陆状态")
          wx.showToast({
            title: '登陆状态',
          })
        } else {
          console.log("sessio过期")
          wx.showToast({
            title: 'session过期',
          })
        }
      }
    })
  },

  // 进入页面
  onNavigatorTag: function(e) {
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    wx.request({
      url: authUrl + '/status',
      header:header,
      success:function(res){
        var status = res.data.data.is_authorized
        console.log(status)
        if(status == 1){
          var type = e.currentTarget.dataset.type
          if (type == 'focusCity') {
            wx.navigateTo({
              url: '../picker/picker?type=focuscity',
            })
          } else if (type == 'focusStock') {
            console.log("stock")
            wx.navigateTo({
              url: '../picker/picker?type=focusstock',
            })
          } else {
            wx.navigateTo({
              url: '../picker/picker?type=focusconstellation',
            })
          }
        } else {
          wx.showToast({
            title: '请先登陆',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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