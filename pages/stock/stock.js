// pages/stock/stock.js
const app = getApp()
const stockUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service/stock'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stockList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateStockData()
  },
  updateStockData: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: stockUrl,
      method: "GET",
      success: function(res) {
        var data = res.data.data
        console.log(data)
        that.setData({
          stockList: data
        })
        wx.hideLoading()
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
    this.updateStockData()
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