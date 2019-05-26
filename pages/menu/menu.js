//menu.js
//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie.js')
const authUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service'

Page({
  data: {
    grids: [],
  },
  //生命周期函数
  onLoad: function(options) {
    this.updateMenuData()
  },
  /**
   * 请求后台，更新menu数据
   */
  updateMenuData: function() {
    var that = this
    if (!app.getAuthStatus) {
      console.log("不登陆请求")
      wx.request({
        url: authUrl + '/menu/list',
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var menuData = res.data.data
          that.setData({
            grids: menuData
          })
          console.log(menuData)
        }
      })
    } else {
      console.log("登陆请求")
      var cookie = cookieUtil.getCookieFromStorage()
      var header = {}
      header.Cookie = cookie
      wx.request({
        url: app.globalData.serverUrl + app.globalData.apiVersion + '/service/menu/user',
        method: "GET",
        header: header,
        success: function(res) {
          var menuData = res.data.data
          if (!menuData) {
            wx.showToast({
              title: '用户暂无应用，请先添加',
            })
          } else {
            console.log(menuData)
            that.setData({
              grids: menuData
            })
          }
        }
      })
    }
  },

  // 增加应用
  moreApp: function() {
    var that = this
    if (!app.getAuthStatus) {
      wx.showToast({
        title: '请先登陆',
      })
    } else {
      wx.navigateTo({
        url: '../applist/applist?userMenu=' + JSON.stringify(that.data.grids),
      })
    }
  },

  // 进入应用
  onNavigatorTap: function(e) {
    var index = e.currentTarget.dataset.index
    var item = this.data.grids[index]
    console.log(item)
    if (item.application == 'weather') {
      console.log('-----------')
      wx.navigateTo({
        url: '../weather/weather',
      })
    } else if (item.application == 'backup-image') {
      console.log('-----------')
      wx.navigateTo({
        url: '../backup/backup',
      })
    } else if (item.application == 'stock') {
      console.log('-----------')
      wx.navigateTo({
        url: '../stock/stock',
      })
    } else if (item.application == 'constellation') {
      console.log('-----------')
      wx.navigateTo({
        url: '../service/service?type=constellation',
      })
    } else if (item.application == 'joke') {
      console.log('-----------')
      wx.navigateTo({
        url: '../service/service?type=joke',
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.updateMenuData()
  },


})