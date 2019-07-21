const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  projectName:String,
  //projectTime:String,
  startTime:Date,
  endTime:Date,
  requirementsUrl:String,
  bugUrl:String,
  testEnvironment:String,
  explain:String,
}, { collection: 'project'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


const Project = module.exports = mongoose.model('project',projectSchema);
