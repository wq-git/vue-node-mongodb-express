//引入mongoose模块
const mongoose = require('mongoose')

//定义数据模型，可以看到，我们下面创建了一个表，表中的数据有username等字段，并且这些字段的数据类型也定义了，最后将model导出即可
const userSchema = mongoose.Schema({
  username: String,
  pw: String,
  role:Array
}, {collection: 'user'})
//这里mongoose.Schema最好要写上第二个参数，明确指定到数据库中的哪个表取数据，我这里写了user_info，目的就是为了以后操作数据要去user_info表中。
//这里不写第二个参数的话，后面你会遇到坑。

//导出model模块
const User = module.exports = mongoose.model('user', userSchema);
