// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('userList').where({
    userName: event.userName
  }).update({
    data: {
      userImage: event.userImage
    },
    success: res => {
      console.log(res)
      wx.showToast({
        title: '新增记录成功',
      })
    },
    fail: err => {
      console.log(err)
    }
  })
}