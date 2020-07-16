// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
   return await cloud.database().collection('userList').where({
      userName: event.userName
    }).get()
}