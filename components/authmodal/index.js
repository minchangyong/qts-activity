Component({
  properties: {
    //属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    getUserInfo(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        wx.setStorage({
          key: 'userName',
          data: e.detail.userInfo.nickName
        })
        wx.setStorage({
          key: 'avatarUrl',
          data: e.detail.userInfo.avatarUrl
        })
        this.triggerEvent('initData')
      }
    }
  }
})
