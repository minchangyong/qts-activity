Page({
  data: {
    isAuth: false,
    isDraw: false,
    isShow: false,
    avatarUrl: '',
    sharePath: '',
    hasPeople: true,
    isDialog: false
  },
  onLoad() {
    this.checkAuth()
    this.initData()
  },
  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.setStorage({
        key: 'avatarUrl',
        data: e.detail.userInfo.avatarUrl.replace('/132', '/0')
      })
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl.replace('/132', '/0')
      }, () => {
        this.creatHeadImg()
      })
    }
  },
  getAuthInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.setStorage({
        key: 'avatarUrl',
        data: e.detail.userInfo.avatarUrl.replace('/132', '/0')
      })
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl.replace('/132', '/0')
      }, () => {
        this.creatRecord()
      })
    }
  },
  initData() {
    wx.request({
      url: 'https://acm.qtshe.com/acm/getConfig', //仅为示例，并非真实的接口地址
      data: {
        key: 'product',
        dataId: 'qts-activity',
        group: 'flutter'
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (res) => {
        this.setData({
          list: JSON.parse(res.data.data).nameList
        })
      }
    })
  },
  checkAuth() {
    if (wx.getStorageSync('avatarUrl')) {
      this.setData({
        isAuth: false,
        avatarUrl: wx.getStorageSync('avatarUrl')
      })
    } else {
      this.setData({
        isAuth: true
      })
    }
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
  creatHeadImg() {
    if (!this.data.sharePath) {
      wx.showLoading({
        title: '生成中'
      })
    }
    this.setData({
      isDraw: true
    })
  },
  creatRecord() {
    this.setData({
      isDialog: !this.data.isDialog
    })
  },
  handleSuccess(e) {
    this.setData({
      isShow: true,
      sharePath: e.detail.sharePath
    })
  },
  closeModal() {
    this.setData({
      isShow: false,
      isDraw: false
    })
  },
  searchQuery(e) {
    let flag = false
    this.data.list.map((item, index) => {
      if (item.name === e.detail.value) {
        this.setData({
          name: item.name,
          hour: item.hour,
          index: item.index,
          startYear: item.startYear,
          online: item.online
        })
        flag = true
        wx.showToast({
          title: '身份校验成功，请确认登机',
          icon: 'none'
        })
      }
    })
    if (!flag) {
      wx.showToast({
        title: '本航班查无此人，请重新输入',
        icon: 'none'
      })
      this.setData({
        query: '',
        name: '',
        hour: '',
        index: '',
        startYear: '',
        online: ''
      })
    }
  },
  handleCreate() {
    if (!this.data.name) {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
      return
    }
    let sendData = {
      name: this.data.name,
      hour: this.data.hour,
      index: this.data.index,
      startYear: this.data.startYear,
      online: this.data.online
    }
    wx.navigateTo({
      url: `/pages/friendship/index?sendData=${JSON.stringify(sendData)}`
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
    return {
      title: `6是我们的超能力!`,
      imageUrl: 'https://qiniu-image.qtshe.com/20190716share-image.png',
      path: '/pages/index/index'
    }
  },
})
