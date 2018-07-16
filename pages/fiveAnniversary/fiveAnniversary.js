Page({
  data: {
    isCanvas: false,
    isPhotoModel: false,
    isAvatarUrl: false,
    myAvatarUrl: wx.getStorageSync('myAvatarUrl'), //用户头像
    showHeartbeat: true,
    canvasImage: '',
    shareImagePath: '' //生成的头像
  },
  onShareAppMessage() {
    return {
      title: `快来领取你的青团社五周年专属头像吧～`,
      imageUrl: 'https://ojlf2aayk.qnssl.com/20180713shareImage.png',
      path: '/pages/fiveAnniversary/fiveAnniversary'
    }
  },
  onLoad() {
    let _this = this
    wx.getImageInfo({
      src: 'https://ojlf2aayk.qnssl.com/20180713beer-icon.png',
      success: (res) => {
        _this.setData({
          canvasImage: res.path
        })
      }
    })
    if (_this.data.myAvatarUrl || wx.getStorageSync('myAvatarUrl')) {
      wx.getImageInfo({
        src: _this.data.myAvatarUrl || wx.getStorageSync('myAvatarUrl'),
        success: (res) => {
          _this.setData({
            isAvatarUrl: true,
            myAvatarUrl: res.path
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
      wx.setStorage({
        key: 'myAvatarUrl',
        data: e.detail.userInfo.avatarUrl.replace(/132/, '0')
      })
      wx.getImageInfo({
        src: e.detail.userInfo.avatarUrl.replace(/132/, '0'),
        success: (res) => {
          _this.setData({
            myAvatarUrl: res.path,
            isAvatarUrl: true
          })
        }
      })
    }
  },
  showPhoto() {
    if (wx.getStorageSync('shareImagePath')) {
      this.setData({
        isPhotoModel: true
      })
    } else {
      if (this.data.myAvatarUrl && this.data.canvasImage) {
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
    var d = 2 * 126
    var cx = 62 + 126
    var cy = 62 + 126
    context.arc(cx, cy, 126, 0, 2 * Math.PI)
    context.clip()
    context.drawImage(this.data.myAvatarUrl, 62, 62, d, d)
    context.restore()
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg() {
    let _this = this
    let context = wx.createCanvasContext('mycanvas')
    let path = this.data.canvasImage
    context.drawImage(path, 0, 0, 375, 375)
    _this.setAvatarUrl(context)
    context.save()
    //绘制图片
    context.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          destWidth: 800,
          destHeight: 800,
          quality: 1,
          fileType: 'png',
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
    })
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
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
