// pages/playVideo/playVideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus: 0,    // 操作按钮的值
    posterUrl: "https://qiniu-app.qtshe.com/IMG_7707.jpg",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onReady() {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  skipPage: function() {
    wx.navigateTo({
      url: '/pages/jobCard/index',
    })
  },

  /**
   * 切换按钮状态
   */
  skipStatus() {
    this.setData({
      showStatus: 3
    })
    this.videoContext.pause()
    setTimeout(() => {
      this.setData({
        showStatus: -1,
      })
      this.videoContext.play()
    }, 3800)
  },

  /**
   * 视频播放结束
   */
  handleEnd() {
    this.setData({
      showStatus: 2,
    })
  },

  /**
   * 播放进度更新
   */
  bindtimeupdate(e) {
    const { currentTime } = e.detail
    if (currentTime > 3 && this.data.showStatus === 0 && !this.isSkiped) {
      this.isSkiped = true
      this.setData({
        showStatus: 1,
        posterUrl: "https://qiniu-app.qtshe.com/last__poster.jpg",
      })
    }
  },


  onShareAppMessage() {
    return getApp().globalData.shareContent
  }
})