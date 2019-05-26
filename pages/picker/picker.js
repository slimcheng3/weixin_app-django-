const app = getApp()
const authUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/auth'
var cookieUtil = require('../../utils/cookie.js')
Page({
  data: {
    isStock: null,
    isConstellation: null,
    isCity: null,
    focusConstellation: [],
    focusStock: [],
    focusCity: [],
    stockIndex: 0,
    stockArray: ["平安银行-000001-sz", "万 科Ａ-000002-sz", "国农科技-000004-sz", "世纪星源-000005-sz"],
    constellationIndex: 0,
    constellationArray: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },

  // 获取关注的城市、股票、星座
  getFocus: function() {
    var that = this
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    wx.request({
      url: authUrl + '/user',
      method: "GET",
      header: header,
      success: function(res) {
        var focus = res.data.data.focus
        that.setData({
          focusCity: focus.city,
          focusStock: focus.stock,
          focusConstellation: focus.constellation
        })
      }
    })
  },

  // 更新选择的关注城市
  cityChange: function(e) {
    var cityArray = e.detail.value
    var cityTmp = cityArray[0] + '-' + cityArray[1] + '-' + cityArray[2]
    console.log(cityTmp)
    var newFocusCity = this.data.focusCity
    newFocusCity.push(cityTmp)
    this.setData({
      focusCity: Array.from(new Set(newFocusCity))
    })
  },

  //删除
  deletePress: function(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.index
    var stockTmp = this.data.focusStock
    var cityTmp = this.data.focusCity
    var constellationTmp = this.data.focusConstellation
    console.log(cityTmp)
    console.log(index)
    console.log(type)
    wx.showModal({
      title: '提示',
      content: '确定要删除此关注吗？',
      success: function(res) {
        if (res.confirm) {
          if (type == "stock") {
            stockTmp.splice(index, 1)
            that.setData({
              focusStock: stockTmp
            })
          } else if (type == "city") {
            cityTmp.splice(index, 1)
            that.setData({
              focusCity: cityTmp
            })
          } else if (type == "constellation") {
            constellationTmp.splice(index, 1)
            that.setData({
              focusConstellation: constellationTmp
            })
          }
        } else if (res.cancel) {}
      }
    })

  },


  // 更新选择的关注股票
  stockChange: function(e) {
    var index = e.detail.value
    var stockTmp = this.data.stockArray[index]
    var newFocusStock = this.data.focusStock
    newFocusStock.push(stockTmp)
    this.setData({
      focusStock: Array.from(new Set(newFocusStock))
    })
  },

  // 保存数据至后台
  onSave: function(e) {
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    var stock = this.data.focusStock
    console.log("stock:" + stock)
    var city = this.data.focusCity
    console.log("city:" + city)
    var constellation = this.data.focusConstellation
    console.log("constellation:" + constellation)
    var data = {
      stock: stock,
      city: city,
      constellation: constellation
    }
    wx.request({
      url: authUrl + '/user',
      method: "POST",
      header: header,
      data: data,
      success: function() {
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },

  // 更新选择的关注星座
  constellationChange: function(e) {
    var index = e.detail.value
    var constellationTmp = this.data.constellationArray[index]
    var newFocusConstellation = this.data.focusConstellation
    newFocusConstellation.push(constellationTmp)
    this.setData({
      focusConstellation: Array.from(new Set(newFocusConstellation))
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var isConstellationTmp = false
    var isCityTmp = false
    var isStockTmp = false
    this.getFocus()
    if (options.type == "focuscity") {
      console.log("city")
      isCityTmp = true

      this.setData({
        isConstellation: isConstellationTmp,
        isCity: isCityTmp,
        isStock: isStockTmp
      })
    } else if (options.type == "focusstock") {
      console.log("stock")
      isStockTmp = true

      this.setData({
        isConstellation: isConstellationTmp,
        isCity: isCityTmp,
        isStock: isStockTmp
      })
    } else {
      console.log("constellation")
      isConstellationTmp = true

      this.setData({
        isConstellation: isConstellationTmp,
        isCity: isCityTmp,
        isStock: isStockTmp
      })
    }
    // 加载用户后台数据



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getJoke()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})