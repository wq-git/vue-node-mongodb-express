CryptoJS = require('crypto-js')
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const User = require("../models/userSchema");

router.post("/userList", (req, res) => {
  var sqlObj = {};
  var token='';
  CryptoJS.AES.encrypt(req.body.username, "secretkey456").toString()
  console.log("userlist",req)
  sqlObj.username = req.body.username;
  //sqlObj.pw = req.body.password;
  var re = User.find(sqlObj);

  re.exec(function (err, results) {
    if (err) {
      //console.log('error')
      res.json({
        status: "fail",
        error: err
      });
    } else {
     // console.log("result1",results,results[0].pw,results[0].role)
      if (results.length > 0&&req.body.password==results[0].pw) {

        token=CryptoJS.AES.encrypt(results[0].role[0], "secretkey456").toString()
        res.json({
          status: "success",
          token:token,
          results:results[0]
        })
      } else {
        //console.log('error')
        //console.log("result2",results.role)
        res.json({
          status: "fail",
          msg:"用户名或密码错误"
        });
      }
    }

  });
})
// //更新一条英雄信息数据路由
// router.put("/hero/:id", (req, res) => {
//   Hero.findOneAndUpdate(
//     { _id: req.params.id },
//     {
//       $set: {
//         name: req.body.name,
//         age: req.body.age,
//         sex: req.body.sex,
//         address: req.body.address,
//         dowhat: req.body.dowhat,
//         favourite: req.body.favourite,
//         explain: req.body.explain
//       }
//     },
//     {
//       new: true
//     }
//   )
//     .then(hero => res.json(hero))
//     .catch(err => res.json(err));
// });
//
// // 添加图片路由
// router.put("/addpic/:id", (req, res) => {
//   Hero.findOneAndUpdate(
//     { _id: req.params.id },
//     {
//       $push: {
//         imgArr: req.body.url
//       }
//     },
//     {
//       new: true
//     }
//   )
//     .then(hero => res.json(hero))
//     .catch(err => res.json(err));
// });
//
// //删除一条英雄信息路由
// router.delete("/hero/:id", (req, res) => {
//   Hero.findOneAndRemove({
//     _id: req.params.id
//   })
//     .then(hero => res.send(`${hero.title}删除成功`))
//     .catch(err => res.json(err));
// });
// // 查询所有英雄信息路由
// router.get("/hero", (req, res) => {
//   Hero.find({})
//     .sort({ update_at: -1 })
//     .then(heros => {
//       res.json(heros);
//     })
//     .catch(err => {
//       console.log(2);
//       res.json(err);
//     });
// });
//
// // 通过ObjectId查询单个英雄信息路由
// router.get("/hero/:id", (req, res) => {
//   Hero.findById(req.params.id)
//     .then(hero => {
//       res.json(hero);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// 添加一个英雄信息路由
  module.exports = router;
