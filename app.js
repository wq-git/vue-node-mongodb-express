const express = require('express');
const user = require('./router/user_login');
const up = require('./router/upload');
const project = require('./router/project');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');//

//这一句是连接上数据库
 var db = mongoose.connect('mongodb://localhost:27017/myDbs');

//这里的myDbs是数据库的名字，不是表的名字
//app.use是用来给path注册中间函数的，这个path默认是'/'，也就是处理任何请求，同时要注意的是他会处理path下的子路径，比如如果设置path为'/hello'，那么当请求路径为'/hello/'，'/hello/nihao','/hello/bye'这样的请求都会交给中间函数处理的。

const app = express()
app.use(bodyParser.json());//解析json数据,bodyParser变量是对中间件的引用。请求体解析后，解析值都会被放到req.body属性，
app.use(bodyParser.urlencoded({ extended: false }));//解析UTF-8的编码的数据
app.use(cookieParser());
app.use('/api',user);
app.use('/api',up);
app.use('/api',project);
app.listen(3000,() => {
    console.log('app listening on port 3000.')
})


