Page({
  data: {
    imgDraw: {},
    sharePath: '',
  },
  onLoad(options) {
    this.setData({
      name: JSON.parse(options.sendData).name,
      startYear: JSON.parse(options.sendData).startYear,
      online: JSON.parse(options.sendData).online + '',
      index: JSON.parse(options.sendData).index,
      hour: JSON.parse(options.sendData).hour + ''
    }, () => {
      this.drawPic()
    })
  },
  handlePhotoSaved() {
    this.savePhoto(this.data.sharePath)
  },
  drawPic() {
    wx.showLoading({
      title: '生成图片中'
    })
    this.setData({
      imgDraw: {
        width: '750rpx',
        height: '1334rpx',
        background: 'https://qiniu-image.qtshe.com/201907120711share-back.png',
        views: [{
            type: 'text',
            text: this.data.name,
            css: {
              top: '520rpx',
              left: '196rpx',
              width: '400rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '32rpx'
            }
          },

          {
            type: 'text',
            text: this.data.startYear,
            css: {
              top: '624rpx',
              left: '90rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '24rpx'
            }
          },
          {
            type: 'text',
            text: this.data.index,
            css: {
              top: '670rpx',
              left: '184rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '24rpx'
            }
          },
          {
            type: 'text',
            text: '2 1 9 2',
            css: {
              top: '714rpx',
              left: '324rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '24rpx'
            }
          },
          {
            type: 'text',
            text: this.data.online,
            css: {
              top: '756rpx',
              left: '210rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '24rpx'
            }
          },
          {
            type: 'text',
            text: this.data.hour,
            css: {
              top: '800rpx',
              left: '260rpx',
              color: '#00cc88',
              fontWeight: 'bold',
              fontSize: '24rpx'
            }
          }
        ]
      }
    })
    if (this.data.online.length === 1) {
      this.setData({
        'imgDraw.views[4].css.left': '240rpx'
      })
    }

    if (this.data.online.length === 3) {
      this.setData({
        'imgDraw.views[4].css.left': '230rpx'
      })
    }

    if (this.data.online.length === 5) {
      this.setData({
        'imgDraw.views[4].css.left': '220rpx'
      })
    }

    if (this.data.hour.length === 5) {
      this.setData({
        'imgDraw.views[5].css.left': '290rpx'
      })
    }
    if (this.data.hour.length === 7) {
      this.setData({
        'imgDraw.views[5].css.left': '270rpx'
      })
    }
  },
  onImgErr(e) {
    wx.hideLoading()
    wx.showToast({
      title: '生成分享图失败，请刷新页面重试'
    })
  },
  onImgOK(e) {
    wx.hideLoading()
    this.setData({
      sharePath: e.detail.path
    })
  },
  preventDefault() {},
  // 保存图片
  savePhoto() {
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.sharePath,
      success: (res) => {
        wx.showToast({
          title: '保存成功'
        })
        setTimeout(() => {
          this.setData({
            visible: false
          })
        }, 300)
      },
      fail: (res) => {
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
        setTimeout(() => {
          wx.hideLoading()
        }, 300)
      }
    })
  }
})
