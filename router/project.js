//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Project = require("../models/projectSchema");
const jwt = require('jsonwebtoken');

//导出项目
router.post("/project/export", (req, res) => {
  const token = req.cookies['User-Token']
  //const token = req.headers["x-token"]

  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  var projectList = Project.find({});
  projectList.exec(function (err, result) {
    if (err) {
      res.json({
        code: 500,
        msg: "fail",
        error: err
      });
    } else {
      console.log("export", result,typeof(result))
      res.json({
        code: 200,
        msg: result
      })
    }
  })


})

// 查询所有项目信息路由
router.post("/project/list", (req, res) => {
  //console.log("1111",req.cookies['User-Token'])
  const token = req.cookies['User-Token']
  //console.log("1111",req.headers["x-token"])
  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  // var heroPosition = new RegExp(req.body.heroPosition),
  var projectName = new RegExp(req.body.projectName);
  //var  projectName= req.body.projectName;
  var pageNumber = req.body.pageNumber;
  var pageRow = req.body.pageRow;

  // 根据查询入参个数，动态生成sql查询语句
  var sqlObj = {};

  if (projectName) {
    sqlObj.projectName = projectName;
  }

  var projectList = Project.find(sqlObj);

  //对查询的结果进行筛选，skip跳过结果集中的前多少
  projectList.skip((pageNumber - 1) * pageRow);
  //对剩下来的数据进行限制返回个数
  projectList.limit(pageRow)

  // 实现分页的关键步骤
  projectList.exec(function (err, result) {
    if (err) {
      res.json({
        status: "fail",
        error: err
      });
    } else {
      Project.find(sqlObj, function (err, projects) {
        res.json({
          status: "success",
          code: 200,
          projectList: result,
          total: projects.length
        });
      })
    }
  })
});
//批量添加项目
router.post("/project/import", (req, res) => {
  //const token = req.headers["x-token"]
  const token = req.cookies['User-Token']
  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  // 使用Hero model上的create方法储存数据
  console.log("body", req.body)
  Project.insertMany(req.body, (err, project) => {
    if (err) {
      res.json({
        status: "fail",
        error: err
      });
    } else {
      console.log("200")
      res.json({
        status: "success",
        code: 200,
        message: "新增成功"
      });
    }
  });
  //console.log(req.body)
});
// 添加一个项目信息路由
router.post("/project/addProject", (req, res) => {
  //const token = req.headers["x-token"]
  const token = req.cookies['User-Token']
  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  // 使用Hero model上的create方法储存数据
  console.log("body", req.body)
  Project.create(req.body, (err, project) => {
    if (err) {
      res.json({
        status: "fail",
        error: err
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        message: "新增成功"
      });
    }
  });
  //console.log(req.body)
});

//更新一条项目信息数据路由
router.put("/project/modifyProject/:id", (req, res) => {
  //const token = req.headers["x-token"]
  const token = req.cookies['User-Token']
  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  console.log(req.params)
  Project.findOneAndUpdate(
    {_id: req.params.id},
    {
      $set: {
        projectName: req.body.projectName,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        requirementsUrl: req.body.requirementsUrl,
        bugUrl: req.body.bugUrl,
        testEnvironment: req.body.testEnvironment,
        explain: req.body.explain,
      }
    },
    {
      new: true
    }
  )
    .then(project => res.json({
      status: "success",
      code: 200,
      message: "修改成功"
    }))
    .catch(err => res.json({
      status: "fail",
      error: "修改失败"
    }));
});


//删除一条项目信息路由
router.delete("/project/deleteProject/:id", (req, res) => {
  //const token = req.headers["x-token"]
  const token = req.cookies['User-Token']
  if (!token||!verifyToken(token)) {
    // !verifyToken(token)
    console.log("401", verifyToken(token))
    return res.json({
      code: 401,
      //msg: err.msg
    })
  }
  Project.findOneAndRemove({
    _id: req.params.id
  })
    .then(project => res.json({
      status: "success",
      message: "删除成功"
    }))
    .catch(err => res.json({
      status: "fail",
      message: "删除失败"
    }));
});


function verifyToken(token) {
  //console.log("verify", token)
  var jwtTokenSecret = "token-key";
  var res = false;
  // 先解密
  jwt.verify(token, jwtTokenSecret, (err, decoded) => {
    //console.log('已验证token 是正确的')
    if (err) {

    } else {
      console.log('已验证token 是正确的', decoded)
      //将携带的信息赋给req.user
      res = true
    }
  })
  return res
}

module.exports = router;




















