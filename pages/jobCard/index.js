Page({
  data: {
    userImage: '',
    userName: ''
  },
  onLoad(options) {

  },
  handleChoose() {
    let timestamp = Date.now()
    wx.chooseImage({
      success: res => {
        wx.showLoading({
          title: '上传中'
        })
        // 将图片上传至云存储空间
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: timestamp + '.png',
          // 指定要上传的文件的小程序临时文件路径
          filePath: res.tempFilePaths[0],
          // 成功回调
          success: todo => {
            console.log('上传成功', todo)
            wx.hideLoading()
            wx.showToast({
              title: '上传图片成功',
            })
            this.setData({
              userImage: todo.fileID || ''
            })
          }
        })
      }
    })
  },
  upDateImage() {
    wx.cloud.callFunction({
      name: 'updateImg',
      data: {
        userName: this.data.userName,
        userImage: this.data.userImage
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  handleUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  handleSearch() {
    if (!this.data.userName) {
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
          wx.hideLoading()
          const {
            data = []
          } = res.result
          if (data.length) {
            this.setData({
              userName: data[0].userName,
              flowerName: data[0].flowerName,
              jobTime: +data[0].jobTime,
              jobNumber: data[0].jobNumber
            }, () => {
              this.upDateImage()
            })
          } else {
            this.setData({
              userName: this.data.userName,
              flowerName: "青团社兼职生",
              jobTime: 1,
              jobNumber: "20200719"
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