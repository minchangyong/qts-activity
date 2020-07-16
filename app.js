//app.js
App({
  onLaunch() {
   wx.cloud.init({
    env: 'prod-1pvnu',
    traceUser: true
   })
  }
 })