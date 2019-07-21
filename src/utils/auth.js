import Cookies from 'js-cookie'
import CryptoJS from "crypto-js"

const TokenKey = 'User-Token'//'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const sk="secretkey123"
//设置cookie
export function setCookie(c_name, c_pwd, exdays) {
  var exdate = new Date(); //获取时间,24 * 60 * 60 * 1000 * exdays
  exdate.setTime(exdate.getTime() + 24 * 60 * 1000 * exdays); //保存的天数
  //对用户名和密码加密
  var cipherName = CryptoJS.AES.encrypt(c_name, sk).toString()
  var cipherPwd = CryptoJS.AES.encrypt(c_pwd, sk).toString()
  //字符串拼接cookie
  window.document.cookie = "userName" + "=" + cipherName + ";path=/;expires=" + exdate.toGMTString();
  window.document.cookie = "userPwd" + "=" + cipherPwd + ";path=/;expires=" + exdate.toGMTString();
}

export function getCookie() {
  var data = {userName: "", passWord: ""}
  if (document.cookie.length > 0) {
    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); //再次切割
      //判断查找相对应的值
      if (arr2[0] == 'userName') {
        //对用户名密码解密
        var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
        data.userName = bytes.toString(CryptoJS.enc.Utf8);
        //保存到保存数据的地方
      } else if (arr2[0] == 'userPwd') {
        var bytes = CryptoJS.AES.decrypt(arr2[1], "secretkey123");
        data.passWord = bytes.toString(CryptoJS.enc.Utf8);
      }
    }
  }
  return data
}

//清除cookie
// clearCookie: function () {
//   this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
