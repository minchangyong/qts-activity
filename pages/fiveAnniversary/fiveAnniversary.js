Page({
  data: {
    isCanvas: false,
    isPhotoModel: false,
    isAvatarUrl: false,
    avatarUrl: '', //用户头像
    showHeartbeat: true,
    shareImagePath: '' //生成的头像
  },
  onLoad() {
    let _this = this
    wx.getImageInfo({
      src: 'https://ojlf2aayk.qnssl.com/20180713logo.png',
      success: (res) => {
        _this.setData({
          canvasImage: res.path
        })
      }
    })
    if (this.data.avatarUrl || wx.getStorageSync('avatarUrl')) {
      wx.getImageInfo({
        src: this.data.avatarUrl || wx.getStorageSync('avatarUrl'),
        success: (res) => {
          _this.setData({
            isAvatarUrl: true,
            avatarUrl: res.path
          })
        }
      })
    }
  },
  hideSaveModel() {
    this.setData({
      isPhotoModel: false,
      isCanvas: false
    })
  },
  dance() {
    let that = this
    let heartbeat = this.selectComponent('#heartbeat')
    heartbeat.dance(() => {
      that.setData({
        showHeartbeat: false
      })
      that.setData({
        showHeartbeat: true,
      })
    })
  },
  getUserInfo(e) {
    let _this = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.showToast({
        title: '授权成功'
      })
      _this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
        isAvatarUrl: true
      })
      wx.setStorage({
        key: 'avatarUrl',
        data: e.detail.userInfo.avatarUrl
      })
    }
  },
  showPhoto() {
    if (wx.getStorageSync('shareImagePath')) {
      this.setData({
        isPhotoModel: true
      })
    } else {
      if (this.data.avatarUrl && this.data.canvasImage) {
        wx.showLoading({
          title: '正在生成...',
          mask: true
        })
        this.setData({
          isCanvas: true
        })
        this.createNewImg()
        setTimeout(() => {
          this.setData({
            isPhotoModel: true
          })
          wx.hideLoading()
        }, 2000)
      } else {
        wx.showToast({
          title: '生成分享图片失败，请稍后重试',
          icon: 'none'
        })
      }
    }
  },
  setAvatarUrl(context) {
    var d = 2 * 121
    var cx = 66 + 121
    var cy = 64 + 121
    context.arc(cx, cy, 121, 0, 2 * Math.PI)
    context.clip()
    context.drawImage(this.data.avatarUrl, 66, 64, d, d)
    context.restore()
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg() {
    let _this = this
    let context = wx.createCanvasContext('mycanvas')
    let path = this.data.canvasImage
    context.drawImage(path, 0, 0, 375, 375)
    _this.setAvatarUrl(context)
    console.log(this.data.avatarUrl)
    //绘制图片
    context.draw()
    context.save()
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: (res) => {
          _this.setData({
            shareImagePath: res.tempFilePath
          })
          wx.setStorage({
            key: 'shareImagePath',
            data: res.tempFilePath
          })
        },
        fail: (res) => {
          console.log(res.errMsg)
        }
      }, this)
    }, 2000)
  },
  savePhoto() {
    let _this = this
    wx.showLoading({
      title: '正在保存...'
    })
    setTimeout(() => {
      wx.saveImageToPhotosAlbum({
        filePath: wx.getStorageSync('shareImagePath') || _this.data.shareImagePath,
        success(res) {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          _this.dance()
          setTimeout(() => {
            wx.hideLoading()
            _this.setData({
              isPhotoModel: false,
              isCanvas: false
            })
          }, 300)
        },
        fail() {
          wx.hideLoading()
          wx.showToast({
            title: '保存失败，请稍后重试',
            icon: 'none'
          })
          setTimeout(() => {
            wx.hideLoading()
            _this.setData({
              isPhotoModel: false,
              isCanvas: false
            })
          }, 300)
        }
      })
    }, 2500)
  }
})
