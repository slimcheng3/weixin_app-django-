const app = getApp()
const imageUrl = app.globalData.serverUrl + app.globalData.apiVersion + '/service/image'

Page({


  /**
   * 页面的初始数据
   */
  data: {
    // 需要上传的图片
    needUploadFiles: [],
    //已下载的备份图片
    downloadedBackupedFiles: [],

  },

  //选择图片上传
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 指定是原图或压缩图，默认两者都有
      sourceType: ['album', 'camera'], // 指定图片来源是相册或相机，默认两者都有
      success: function(res) {
        //返回指定图片的本地地址
        that.setData({
          needUploadFiles: that.data.needUploadFiles.concat(res.tempFilePaths)
        });
      }
    })
  },

  // 上传文件
  uploadFiles: function() {
    var that = this;
    for (var i = 0; i < this.data.needUploadFiles.length; i++){
      var filePath = this.data.needUploadFiles[i];
      wx.uploadFile({
        url: imageUrl,
        filePath: filePath,
        name: 'test',
        success: function(res){
          var res = JSON.parse(res.data)
          var md5 = res.data[0].md5
          var name = res.data[0].name
          var newImageItem = {
            "md5": md5,
            "name": name
          }
          that.downloadFile(newImageItem)
          that.setData({
            needUploadFiles: []
          })
        }
      })
    }

  },

  //downloadFile
  downloadFile: function(imgItem) {
    var that = this
    wx.downloadFile({
      url: imageUrl + '?md5=' + imgItem.md5,
      success: function (res){
        console.log("sucees loaded")
        var temPath = res.tempFilePath
        console.log(temPath)
        var newDownloadedBackedFiles = that.data.downloadedBackupedFiles
        imgItem.path = temPath
        newDownloadedBackedFiles.unshift(imgItem)
        that.setData({
          downloadedBackupedFiles: newDownloadedBackedFiles
        })
      }

    })

  },

  // 删除图片
  deleteBackup: function(imgItem){
    wx.request({
    url: imageUrl + '?md5=' + imgItem.md5,
    method: 'DELETE',
    success: function(res){
      console.log(res.data);
      wx.showToast({
        title: '删除成功'
      })
    }
    })
  },

  longTapConfirm: function(e) {
    var that = this
    var confirmList = ["删除备份"]
    wx.showActionSheet({
      itemList: confirmList,
      success: function(res) {
        if (res.cancel) {
          return
        }
        var imageIndex = e.currentTarget.dataset.index
        var imageItem = that.data.downloadedBackupedFiles[imageIndex]
        var newList = that.data.downloadedBackupedFiles
        newList.splice(imageIndex, 1)
        that.setData({
          downloadedBackupedFiles: newList
        })
        that.deleteBackup(imageItem)
        }
    })
  },

  // 待上传图片长按操作
  longTapConfirm_upload: function(e) {
    var that = this
    var confirmList = ["取消上传"]
    wx.showActionSheet({
      itemList: confirmList,
      success: function (res) {
        if (res.cancel) {
          return
        }
        var imageIndex = e.currentTarget.dataset.index
        var imageItem = that.data.needUploadFiles[imageIndex]
        var newList = that.data.needUploadFiles
        newList.splice(imageIndex, 1)
        that.setData({
          needUploadFiles: newList
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.downloadAllFromRemote()
    console.log("载入后台图片")
  },

  downloadAllFromRemote: function () {
    var that = this
    console.log(that.data.downloadedBackupedFiles)
    wx.request({
      url: imageUrl + '/list',
      method: "GET",
      success: function(res) {
        var imageList = res.data.data
        console.log(imageList)
        for (var i = 0; i < imageList.length; i ++) {
          var imageItem = imageList[i]
          console.log(imageItem)
          that.downloadFile(imageItem)
        }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})