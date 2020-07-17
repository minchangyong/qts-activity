// pages/createImage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgDraw: {},
    colorList:  ['#00d870', '#fff560', '#44f4b0', '#44fce9', '#4482ff', '#ff7e31', '#ffa200', '#ffd200']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userImage: options.userImage || '',
      userName: options.userName
    })
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        userName: options.userName
      },
      success: res => {
        console.log(res)
        if (res.result) {
          const { data = [] } = res.result
          if (data.length) {
            this.setData({
              userName: data[0].userName,
              flowerName: data[0].flowerName,
              jobTime: +data[0].jobTime,
              jobNumber: data[0].jobNumber
            }, () => {
              wx.setNavigationBarColor({
                frontColor: this.data.jobTime === 1 ? '#000000' :  '#ffffff',
                backgroundColor: this.data.colorList[this.data.jobTime]
              })
              this.drawPic()
            })
          } else {
            this.setData({
              userName: this.data.userName,
              flowerName: "青团社兼职生",
              jobTime: 0,
              jobNumber: "20200719"
            }, () => {
              this.drawPic()
              wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: this.data.colorList[0]
              })
            })
          }
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  drawPic() {
    this.setData({
      imgDraw: {
        width: '750rpx',
        height: '1334rpx',
        background: `https://qiniu-image.qtshe.com/20200717back-${this.data.jobTime}.png`,
        views: [
          {
            type: 'image',
            url: this.data.userImage,
            css: {
              top: '380rpx',
              left: '160rpx',
              width: '500rpx',
              height: '500rpx',
              mode: "scaleToFill"
            }
          },
          {
            type: 'text',
            text: this.data.jobNumber,
            css: {
              top: '962rpx',
              left: '182rpx',
              fontWeight: 'bold',
              fontSize: '34rpx',
              color: '#000'
            }
          },
          {
            type: 'text',
            text: this.data.flowerName,
            css: {
              top: '1004rpx',
              left: '182rpx',
              fontWeight: 'bold',
              fontSize: '40rpx',
              color: '#000'
            }
          },
          {
            type: 'text',
            text: this.data.userName,
            css: {
              top: '1060rpx',
              left: '182rpx',
              fontSize: '36rpx',
              color: '#3c3c3c'
            }
          }
        ]
      }
    })
  },
  onImgOK(e) {
    this.setData({
      sharePath: e.detail.path
    })
  },
  savePhoto() {
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.sharePath,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
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
      }
    })
  }
})