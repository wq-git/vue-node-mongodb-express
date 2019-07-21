CryptoJS = require('crypto-js')
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const User = require("../models/userSchema");
const jwt = require('jsonwebtoken');


router.post("/login", (req, res) => {
  var sqlObj = {};
  const secretOrKey="token-key"

  sqlObj.username = req.body.username;
  //sqlObj.pw = req.body.password;
  var re = User.find(sqlObj);

  re.exec(function (err, results) {
    //console.log("yonghu",results)
    if (err) {
      //console.log('error')
      res.json({
        status: "fail",
        error: err
      });
    } else {
     // console.log("result1",results,results[0].pw,results[0].role)
      if (results.length > 0&&req.body.password==results[0].pw) {
        const payload = {id: results[0]._id, name:results[0].username}
        const token = jwt.sign(payload,secretOrKey, {expiresIn: 60*5 })//秒为单位
        console.log("token=",token)
        res.json({
          status: "success",
          code:200,
          token:token,
          results:results[0]
        })
      } else {
        res.json({
          status: "fail",
          msg:"用户名或密码错误"
        });
      }
    }

  });
})
//路由中间件
// router.use(function jwtVerify(req, res, next) {
//     //let token = req.get('token')
//     console.log("jwt",req)
//     var jwtTokenSecret = "token-key";
//     // 先解密
//     const token=""
//     jwt.verify(token, jwtTokenSecret, (err, decoded) => {
//         console.log('已验证token 是正确的')
//         if(err){
//             return res.json({
//                 code: 401,
//                 msg: err.msg
//             })
//         } else {
//           // 将携带的信息赋给req.user
//             req.user = decoded
//             return next()
//         }
//     })
// });

  module.exports = router;
