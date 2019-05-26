// pages/service/service.js
const app = getApp()
const constellationUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service/constellation'
const jokeUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service/joke'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    constellation: [],
    joke: [],
    isConstellation: false,
    isJoke: false,
    cachedImg: null
  },

  getConstellation: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: constellationUrl,
      method: "GET",
      success: function(res) {
        var data = res.data.data
        console.log(data)
        that.setData({
          constellation: data
        })
        wx.hideLoading()
      }
    })
  },

  getJoke: function() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: jokeUrl,
      method: "GET",
      success: function (res) {
        var data = res.data.data
        for (var i=0;i<data.length;i++) {
          if (data[i].ispic) {
            var imgUrl = data.content
            wx.uploadFile({
              url: imgUrl,
              success: function (res) {
                var temPath = res.tempFilePath
                data[i].content = temPath
              }
            })
          }
        } 
        that.setData({
          joke: data
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var consteTmp = false
    var jokeTemp = false
    if (options.type == "constellation") {
      console.log("星座运势")
      consteTmp = true
      this.getConstellation()
      this.setData({
        isJoke: jokeTemp,
        isConstellation: consteTmp
      })
    } else if (options.type == "joke") {
      jokeTemp = true
      this.getJoke()
      this.setData({
        isJoke: jokeTemp,
        isConstellation: consteTmp
      })
    }
  },

  // 点击预览图片
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    var imgUrl = this.data.joke[index].content
    console.log(imgUrl)
    wx.previewImage({
      current: imgUrl,
      urls: [imgUrl],
      success: function() {}
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
    this.getJoke()
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