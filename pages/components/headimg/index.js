Component({
  properties: {
    isDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    }
  },
  data: {
    isCanvas: true,
    imgDraw: {}
  },
  methods: {
    drawPic() {
      if (this.data.sharePath) {
        this.triggerEvent('creatImgOK', {
          sharePath: this.data.sharePath
        })
        return
      } else {
        this.setData({
          imgDraw: {
            width: '750rpx',
            height: '750rpx',
            background: 'https://qiniu-image.qtshe.com/20190712headImg-back.png',
            views: [{
              type: 'image',
              url: wx.getStorageSync('avatarUrl') || 'https://qiniu-image.qtshe.com/default-avatar20170707.png',
              css: {
                top: '124rpx',
                left: '124rpx',
                width: '502rpx',
                height: '502rpx',
                borderRadius: '502rpx',
                borderWidth: '6rpx',
                borderColor: '#FFF',
              }
            }]
          }
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
      this.triggerEvent('creatImgOK', {
        sharePath: e.detail.path
      })
    },
    preventDefault() {}
  }
})
