Page({
  data: {

  },

  /**
   * 跳转到视频播放页面
   */
  skipPage() {
    wx.navigateTo({
      url: '/pages/playVideo/playVideo',
    })
  },

  containerTap(res) {
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    this.setData({
      rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    });
  },

  onLoad() {
    // this.selectQuery()
  },


  selectQuery() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        userName: '闵昌勇'
      },
      success: res => {
        console.log(res)
        const {
          data = []
        } = res.result
        if (data.length) {
          this.setData({
            userName: data[0].userName,
            flowerName: data[0].flowerName,
            jobTime: +data[0].jobTime,
            jobNumber: data[0].jobNumber
          })
        } else {
          wx.showToast({
            title: '暂未查到您的在职信息',
            icon: 'none'
          })
        }
      }
    })
  },
  // 保存图片
  savePhoto() {
    wx.showLoading({
      title: '正在保存',
      mask: true
    })
    this.setData({
      isDraw: false
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.sharePath,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          duration: 2000
        })
        setTimeout(() => {
          this.setData({
            isShow: false
          })
        }, 300)
      },
      fail: (res) => {
        console.log(res)
        wx.hideLoading()
        wx.getSetting({
          success: res => {
            let authSetting = res.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              wx.showModal({
                title: '提示',
                content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  onShareAppMessage() {
    return getApp().globalData.shareContent
  },
})