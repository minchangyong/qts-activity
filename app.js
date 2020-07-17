import GlobalConfig from './config/index.js'

const globalConfig = new GlobalConfig()

globalConfig.init()
App({
  globalData: {
    config: globalConfig,
    shareContent: {
      title: `快来领取专属彩蛋！`,
      imageUrl: 'https://qiniu-image.qtshe.com/20200717share.png',
      path: '/pages/index/index'
    }
  },
  onLaunch() {
   wx.cloud.init({
    env: 'prod-1pvnu',
    traceUser: true
   })
  }
 })