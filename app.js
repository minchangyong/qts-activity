import GlobalConfig from './config/index.js'

const globalConfig = new GlobalConfig()

globalConfig.init()
App({
  globalData: {
    config: globalConfig
  },
  onLaunch() {
   wx.cloud.init({
    env: 'prod-1pvnu',
    traceUser: true
   })
  }
 })