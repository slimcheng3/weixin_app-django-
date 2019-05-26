// pages/applist/applist.js
const app = getApp()
const cookieUtil = require('../../utils/cookie.js')
const authUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAppData: [],
    allAppData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(1111)
    console.log(options.userMenu)
    var data = JSON.parse(options.userMenu)
    //用户app初始化
    this.setData({
      userAppData: data
    })
    console.log(222)


    //获取所有应用
    wx.request({
      url: authUrl + '/menu/list',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var menuData = res.data.data
        console.log(1111, menuData)
        that.setData({
          allAppData: menuData
        })
      }
    })
  },

  // 更新选择的应用
  bindAppPickerChange: function (e) {
    var allApp = this.data.allAppData
    var index = e.detail.value
    console.log(1111, index)
    var userAppTmp = this.data.userAppData
    console.log(typeof (userAppTmp))
    var newApp = allApp[index]
    for (var i = 0; i < this.data.userAppData.length; i++) {
      if (newApp.appid == userAppTmp[i].appid) {
        return
      }
    }
    userAppTmp.push(newApp)
    this.setData({
      userAppData: userAppTmp

    })
  },

  // 删除选择的应用
  deleteItem: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index
          var newUserApp = that.data.userAppData
          newUserApp.splice(index, 1)
          that.setData({
            userAppData: newUserApp
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  //保存用户数据
  onSave: function () {
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    var userApp = this.data.userAppData
    var data = {
      "data": userApp
    }
    wx.request({
      url: authUrl + '/menu/user',
      method: "POST",
      header: header,
      data: data,
      success: function () {
        wx.showToast({
          title: '保存成功',
        })
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
    this.updateMenuData()
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