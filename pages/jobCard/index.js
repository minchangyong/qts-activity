Page({
  data: {
    userImage: '',
    userName: ''
  },
  onShow() {
    this.setData({
      userImage: wx.getStorageSync('userImage') || ''
    })
  },
  handleChoose() {
    wx.chooseImage({
      success: res => {
        wx.navigateTo({
          url: `/pages/imgCropper/index?src=${res.tempFilePaths[0]}`,
        })
      }
    })
  },
  handleUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  handleSelect() {
    wx.showActionSheet({
      itemList: ['重新上传', '删除'],
      success:  (res) => {
        if (res.tapIndex === 0) {
          this.handleChoose()
        } else if (res.tapIndex === 1) {
          this.setData({
            userImage: ''
          })
          wx.removeStorageSync('userImage')
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  handleSearch() {
    if (!this.data.userImage) {
      wx.showToast({
        title: '请先上传您的照片',
        icon: 'none'
      })
    } else if (!this.data.userName) {
      wx.showToast({
        title: '请先输入您的姓名',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '查询中'
      })
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {
          userName: this.data.userName
        },
        success: res => {
          console.log(res)
          wx.hideLoading()
          const {
            data = []
          } = res && res.result
          if (data.length) {
            this.setData({
              userName: data[0].userName,
              flowerName: data[0].flowerName,
              jobTime: +data[0].jobTime,
              jobNumber: data[0].jobNumber
            })
            wx.navigateTo({
              url: `/pages/createImage/index?userName=${this.data.userName}&userImage=${this.data.userImage}`
            })
          } else {
            this.setData({
              userName: this.data.userName,
              flowerName: "青团社兼职生",
              jobTime: 0,
              jobNumber: "20200719"
            })
            wx.navigateTo({
              url: `/pages/createImage/index?userName=${this.data.userName}&userImage=${this.data.userImage}`
            })
          }
        },
        fail: error => {
          wx.hideLoading()
          console.log(error)
        }
      })
    }
  }
})