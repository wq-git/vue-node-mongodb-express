import axios from 'axios'
import store from '../store'
import router from "../router"
import {MessageBox, Message} from 'element-ui'
//import { getToken } from './auth'

// 创建axios实例
const service = axios.create({
  baseURL: "http://localhost:8080/api", // api 的 base_url,相当于http://localhost:3000
  timeout: 5000 // 请求超时时间
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = store.getters.token//getToken()
    }
    return config
  },
  error => {
    // do something with request error
    //console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    //console.log("res:", res, response)
    //返回状态值是200 即返回数据
    if (res.code === 200) {
      //console.log("hello,200")
      return response
    }
    //返回状态值401即跳转到登录页面
    if (res.code === 401) {
      //window.location.href = '/login'
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(action => {
        if (action == 'confirm') {
          console.log("confirm")//确认的回调
          store.commit('user/resetToken')
          router.push("/login")
          //window.location.href = '/login'
          // store.commit('user/resetToken').then(() => {
          //   window.location.href = '/login'
          //   //router.push("/login")
          //   //location.reload()
          // })
        }
      }).catch(err => {
        if (err == 'cancel') {
          console.log("cancel")    //取消的回调
          router.push("/401")
          //location.reload()
        }
      })
      return Promise.reject(res)
    }
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      error.msg = '请求超时，请重试'
    }
  }, error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })
// 里面可以加上axios里面的拦截器，本需求没有必要，就没加上，可自行根据项目选择

export default service
