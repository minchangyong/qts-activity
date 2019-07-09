const list = require('../list.js')
Page({
  data: {
    isAuth: false
  },
  onLoad() {
    this.checkAuth()
  },
  checkAuth() {
    if (wx.getStorageSync('avatarUrl')) {
      this.setData({
        isAuth: false
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
  searchQuery(e) {
    list.nameList.map((item, index) => {
      if (item.name === e.detail.value) {
        this.setData({
          name: item.name,
          hour: item.hour,
          index: item.index,
          startYear: item.startYear,
          online: item.online
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: `快来领取你的青团社六周年专属头像吧～`,
      imageUrl: 'https://ojlf2aayk.qnssl.com/20180713shareImage.png',
      path: '/pages/index/index'
    }
  },
})
