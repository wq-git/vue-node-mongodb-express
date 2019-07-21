<template lang="html">
  <div class="list">
    <header>
      <label for="" class="formLabelCss">项目:</label>
      <el-input v-model="projectName" class="formInputCss" clearable placeholder="请输入项目名称"></el-input>
      <el-button type="primary" class="searchBtn" icon="el-icon-search" @keyup.enter.native="search" @click="search">
        查询
      </el-button>
      <el-button type="text" @click="clear">清空</el-button>
    </header>

    <span>
      <el-button v-permission="['admin']" type="primary" class="addBtn" @click="add" icon="el-icon-plus">添加</el-button>
      <div class="batchOp">
        <el-button v-permission="['admin']" type="primary" @click="dialogFormVisible = true" class="excelBtn"
                   plain>批量导入</el-button>
        <el-button type="success" @click="exportJob" class="excelBtn" plain>导出</el-button>
      </div>
    </span>

    <main>
      <!--        //当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。-->
      <!--        //stripe带斑马纹，border竖直方向的边框的-->
      <el-table
        :data="tableData"
        id="download"
        element-loading-text="拼命加载中"
        header-row-class-name="tableHeader"
        v-loading.fullscreen.lock="loading"
        empty-text="亲，暂时没有数据哦"
        border
        style="width: 100%;margin-top: 30px">
        <el-table-column
          prop="projectName"
          label="项目名称"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          label="项目排期"
          align="center"
          width="160">
          <template slot-scope="scope">
            {{new Date(scope.row.startTime).toLocaleDateString()}} - {{new
            Date(scope.row.endTime).toLocaleDateString()}}
          </template>

        </el-table-column>
        <el-table-column

          label="项目需求"
          align="center"
          width="180">
          <template slot-scope="scope">
            <a :href="scope.row.requirementsUrl"
               target="_blank">
              {{scope.row.requirementsUrl}}
            </a>
          </template>
        </el-table-column>

        <el-table-column

          label="项目bug统计"
          align="center"
          width="180">
          <template slot-scope="scope">
            <a :href="scope.row.bugUrl"
               target="_blank">
              {{scope.row.bugUrl}}
            </a>
          </template>

        </el-table-column>
        <el-table-column
          prop="testEnvironment"
          label="测试环境"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="explain"
          label="备注"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="240">
          <template slot-scope="scope">
            <!--            <el-button size="small" type="primary" @click="toDetail(scope.row['_id'])">详情</el-button>-->
            <el-button size="small" type="success" @click="modify(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteProject(scope.row['_id'])">删除</el-button>
            <!--            <el-button type="warning" size="small" @click="addPic(scope.row['_id'])">添加图片</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="paginationShow"
        class="pagination"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="total, prev, pager, next, jumper"
        :total="length">
      </el-pagination>
    </main>
    <el-dialog title="批量导入" :visible.sync="dialogFormVisible" @close="clearFileList">
      <div class="importExcel">
        <el-upload
          ref="upload"
          style="margin-left:140px"
          drag
          :auto-upload="false"
          :multiple='false'
          :on-change="onUploadChange"
          :on-remove="clearFileList"
          :before-upload="clearFileList"
          accept=".xlsx, .xls"
          action=""
          :limit="1"
          center
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">注意：仅支持上传excel文件的xlsx、xls格式</div>

        </el-upload>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearFileList">取 消</el-button>
        <el-button type="primary" @click="importEXCEL">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增数据 -->
    <el-dialog title="新增数据" :visible.sync="addFormVisible" class="addArea" modal custom-class="addFormArea"
               @close="closeAdd('addForm')">
      <el-form :model="addForm" class="addForm" :rules="rules" status-icon ref="addForm">

        <el-form-item label="项目名称:" :label-width="formLabelWidth" prop="projectName">
          <el-input v-model="addForm.projectName" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>

        <el-form-item label="项目开始日期:" :label-width="formLabelWidth" prop="startTime">
          <div class="block">
            <el-date-picker
              v-model="addForm.startTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-form-item>
        <el-form-item label="项目结束日期:" :label-width="formLabelWidth" prop="endTime">
          <div class="block">
            <el-date-picker
              v-model="addForm.endTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-form-item>
        <el-form-item label="项目需求:" :label-width="formLabelWidth" prop="requirementsUrl">
          <el-input v-model="addForm.requirementsUrl" auto-complete="off" placeholder="请输入项目需求"></el-input>
        </el-form-item>

        <el-form-item label="测试环境:" :label-width="formLabelWidth" prop="testEnvironment">
          <el-input v-model="addForm.testEnvironment" auto-complete="off" placeholder="请输入项目测试环境"></el-input>
        </el-form-item>

        <el-form-item label="项目bug统计:" :label-width="formLabelWidth" prop="bugUrl">
          <el-input v-model="addForm.bugUrl" auto-complete="off" placeholder="请输入bug地址"></el-input>
        </el-form-item>

        <el-form-item label="备注:" :label-width="formLabelWidth" prop="explain">
          <el-input v-model="addForm.explain" auto-complete="off" placeholder="请输入项目备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addSure('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改数据 -->
    <el-dialog title="修改数据" :visible.sync="modifyFormVisible" class="addArea" modal custom-class="addFormArea"
               @close="closeModify('modifyForm')">
      <el-form :model="modifyForm" class="addForm" :rules="rules" status-icon ref="modifyForm">

        <el-form-item label="项目名称:" :label-width="formLabelWidth" prop="projectName">
          <el-input v-model="modifyForm.projectName" auto-complete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>

        <el-form-item label="项目开始日期:" :label-width="formLabelWidth" prop="startTime">
          <div class="block">
            <el-date-picker
              v-model="modifyForm.startTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </div>
        </el-form-item>
        <el-form-item label="项目结束日期:" :label-width="formLabelWidth" prop="endTime">
          <div class="block">
            <el-date-picker
              v-model="modifyForm.endTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="项目需求:" :label-width="formLabelWidth" prop="requirementsUrl">
          <el-input v-model="modifyForm.requirementsUrl" auto-complete="off" placeholder="请输入项目需求"></el-input>
        </el-form-item>

        <el-form-item label="测试环境:" :label-width="formLabelWidth" prop="testEnvironment">
          <el-input v-model="modifyForm.testEnvironment" auto-complete="off" placeholder="请输入项目测试环境"></el-input>
        </el-form-item>

        <el-form-item label="项目bug统计:" :label-width="formLabelWidth" prop="bugUrl">
          <el-input v-model="modifyForm.bugUrl" auto-complete="off" placeholder="请输入bug地址"></el-input>
        </el-form-item>

        <el-form-item label="备注:" :label-width="formLabelWidth" prop="explain">
          <el-input v-model="modifyForm.explain" auto-complete="off" placeholder="请输入项目备注"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifySure('modifyForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from "../../utils/request";
  import permission from "../../directive/permission/index.js";
  import XLSX from "xlsx";

  export default {

    directives: {permission},
    name: "projectList",
    data: function () {
      return {

        f: '',
        excelData: {
          header: null,
          results: null
        },
        dialogFormVisible: false,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },

        title: 'projectsList',
        paginationShow: true,
        projectName: "",
        projectTime: "",
        requirementsUrl: "",
        bugUrl: "",
        testEnvironment: "",
        explain: "",
        temp: '',

        // 校验规则
        rules: {
          projectName: [
            {required: true, message: "请输入项目名称", trigger: "blur"}
          ],
          startTime: [
            {required: true, message: "请选择项目开始日期", trigger: "blur"}
          ],
          endTime: [
            {required: true, message: "请选择项目结束日期", trigger: "blur"}
          ],
          requirementsUrl: [
            {required: true, message: "请填写项目需求链接", trigger: "blur"}
          ],
        },
        currentPage: 1, //当前页数
        pageNumber: 1, //第几页
        pageRow: 5, //每页多少条
        length: 0, //共有多少条
        searchUrl: "./project/list",
        addUrl: "./project/addProject",
        modifyUrl: "./project/modifyProject",
        deleteUrl: "./project/deleteProject",
        exportUrl: "./project/export",
        importUrl: "./project/import",

        tableData: [],
        addFormVisible: false,
        modifyFormVisible: false,

        modifyId: "",

        addForm: {
          projectName: "",
          startTime: "",
          endTime: "",
          requirementsUrl: "",
          bugUrl: "",
          testEnvironment: "",
          explain: ""
        },
        modifyForm: {
          projectName: "",
          startTime: "",
          endTime: "",
          requirementsUrl: "",
          bugUrl: "",
          testEnvironment: "",
          explain: ""
        },
        formLabelWidth: "120px",
        loading: false
      };
    },
    methods: {

      errorMsg(file) {
        console.log(!this.isExcel(file))
        if (!this.isExcel(file))
          this.$message.error('Only supports upload .xlsx, .xls')
      },
      clearFileList() {
        this.$refs.upload.clearFiles()
        this.dialogFormVisible = false
        this.temp = ''

      },
      onUploadChange(file) {
        //console.log(e)
        console.log(!this.isExcel(file))
        if (!this.isExcel(file)) {
          this.$message.error('Only supports upload .xlsx, .xls')
          return false
        }
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsArrayBuffer(file.raw)
          reader.onload = e => {
            console.log(e)
            const data = e.target.result
            const workbook = XLSX.read(data, {type: 'array'})
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const header = this.getHeaderRow(worksheet)
            const results = XLSX.utils.sheet_to_json(worksheet)
            this.generateData({header, results})
            this.loading = false
            resolve()
          }
        })

      },

      formatJson(filterVal, jsonData) {
        return jsonData.map(v => this.concate(filterVal.map(j => v[j])))
      },
      fiterData(results) {
        var resList = []
        console.log(results)
        for (var i = 0; i < results.length; i++) {
          var res = {
            projectName: "",
            startTime: "",
            endTime: "",
            requirementsUrl: "",
            bugUrl: "",
            testEnvironment: "",
            explain: ""
          }

          res.projectName = results[i]["项目名称"]
          res.requirementsUrl = results[i]["项目需求"]
          res.bugUrl = results[i]["项目bug统计"]
          res.testEnvironment = results[i]["测试环境"]
          res.explain = results[i]["备注"]
          console.log(results[i]["项目结束"])
          var t = results[i]["项目结束"].split("-")
          //console.log('ttt', t)
          res.startTime = t[0]
          res.endTime = t[1]
          resList[i] = res
        }
        //console.log("List", resList)
        return resList
      },
      importEXCEL() {
        var that = this
        this.dialogFormVisible = false
        if (!this.temp) {
          this.$message({
            message: "新增失败",
            type: "error"
          });
          that.clearFileList()
          that.search()
          return
        }
        request({
          url: "./project/import",
          method: "post",
          data: this.temp
        })
          .then(response => {
            console.log("yes")
            this.loading = false;
            if (response.data.status == "success") {
              this.$message({
                message: response.data.message,
                type: "success",
                onClose: function () {
                  that.search();
                }
              });
            } else {
              that.clearFileList()
              this.$message({
                message: "新增失败",
                type: "error"
              });
            }
          })
          .catch(error => {
            console.log("no")
            console.log(error);
          });

        that.clearFileList()

      },
      generateData({header, results}) {
        this.temp = this.fiterData(results)

      },
      getHeaderRow(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      isExcel(file) {
        return /\.(xlsx|xls|csv)$/.test(file.name)
      },

      concate(l) {
        console.log("l++", new Date(l[1]).toLocaleDateString())
        l[1] = new Date(l[1]).toLocaleDateString() + '-' + new Date(l[2]).toLocaleDateString()
        l.splice(2, 1)
        console.log("l---")
        return l
      },

      export2Excel(list) {
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../Export2Excel');
          const tHeader = ['项目名称', '项目结束', '项目需求', '项目bug统计', '测试环境', '备注'];
          const filterVal = ['projectName', 'startTime', 'endTime', 'requirementsUrl', 'bugUrl', 'testEnvironment', 'explain'];
          console.log("000" + list)
          //const list = this.goodsItems;
          var data = this.formatJson(filterVal, list);
          //console.log("data000"+typeof(data))
          //data=filtera(data)
          export_json_to_excel(tHeader, data, '项目列表');
        })
      },
      // computed('startTime', 'endTime')

      //导出
      exportJob() {
        request({
          url: this.exportUrl,
          method: "post",
        })
          .then(response => {
            console.log("data2" + response.data.msg)
            if (response.data.code == 200) {
              this.export2Excel(response.data.msg)
              console.log(response.data.msg)
            } else {
              this.$message({
                message: "导出出错，请重试!",
                type: "error"
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      // 清除查询条件
      clear() {
        this.projectName = "";
      },

      //查询
      search() {
        this.paginationShow = false;
        var searchParmas = {
          projectName: this.projectName,
          //projectTime: this.projectTime,
          pageNumber: this.pageNumber,
          pageRow: this.pageRow
        };
        this.loading = true;
        request({
          url: this.searchUrl,
          method: "post",
          data: searchParmas
        })
          .then(response => {
            this.$nextTick(function () {
              this.paginationShow = true;
            });
            this.loading = false;
            if (response.data.status == "success") {
              this.tableData = response.data.projectList;
              this.length = response.data.total;
            } else {
              this.tableData = [];
              this.$message({
                message: "查询出错，请重试!",
                type: "error"
              });
            }
          })
          .catch(error => {
            this.$nextTick(function () {
              this.paginationShow = true;
            });
            console.log(error);
          });

        //每次查询删除本地缓存
        sessionStorage.removeItem("queryParmas");
      },

      //页数改变时出发的函数
      // 模板字符串使用反引号 (` `) 来代替普通字符串中的用双引号和单引号。模板字符串可以包含特定语法（${expression}）的占位符。
      handleCurrentChange: function (val) {
        this.pageNumber = `${val}`;
        this.search();
      },
      // 添加
      add() {
        this.addFormVisible = true;
      },

      // 关闭添加页面，点击取消按钮本身form里的内容都清空
      closeAdd: function (formName) {
        this.$refs[formName].resetFields();
      },
      // 确认添加
      addSure(formName) {
        var createParmas = {
          startTime: this.addForm.startTime,
          endTime: this.addForm.endTime,
          projectName: this.addForm.projectName,
          requirementsUrl: this.addForm.requirementsUrl,
          bugUrl: this.addForm.bugUrl,
          testEnvironment: this.addForm.testEnvironment,
          explain: this.addForm.explain,
        };
        this.$refs[formName].validate(valid => {
          if (valid) {
            var that = this;
            this.addFormVisible = false;
            //调新增接口,在回调函数中刷新一次
            request({
              url: this.addUrl,
              method: "post",
              data: createParmas
            })
              .then(response => {

                this.loading = false;
                if (response.data.status == "success") {
                  this.$message({
                    message: response.data.message,
                    type: "success",
                    onClose: function () {
                      that.search();
                    }
                  });
                } else {
                  this.$message({
                    message: "新增失败",
                    type: "error"
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
        // })
      },
      // 关闭dialog的函数
      closeModify: function (formName) {
        this.$refs[formName].resetFields();
      },

      //修改操作
      modify(row) {
        this.modifyFormVisible = true;
        this.modifyForm = Object.assign({}, row);
        this.modifyId = row["_id"];
      },

      // 确认修改
      modifySure(formName) {
        var that = this;

        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("modify", this.modifyForm)
            request({
              url: `${this.modifyUrl}/${this.modifyId}`,
              method: "put",
              data: this.modifyForm
            })
              .then(response => {
                this.modifyFormVisible = false;
                if (response.data.status == "success") {
                  this.$message({
                    message: response.data.message,
                    type: "success",
                    onClose: function () {
                      that.search();
                    }
                  });
                } else {
                  console.log(response.data.error);
                  this.$message({
                    message: "修改失败",
                    type: "error",
                    onClose: function () {
                      that.search();
                    }
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 删除操作
      deleteProject(id) {
        var that = this;
        var deleteId = id;
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request({
              url: `${this.deleteUrl}/${deleteId}`,
              method: "delete"
            })
              .then(response => {
                if (response.data.status == "success") {
                  this.$message({
                    message: "删除成功",
                    type: "success",
                    onClose: function () {
                      that.search();
                    }
                  });
                } else {
                  this.$message({
                    message: "删除失败",
                    type: "error",
                    onClose: function () {
                      that.search();
                    }
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },

      //页面初始化进来查询数据
      mounted: function () {
        // 进入页面判断是否存在缓存
        var sessionObj = sessionStorage.getItem("queryParmas");
        if (sessionObj) {
          var queryParmas = JSON.parse(sessionObj);
          this.projectName = queryParmas.projectName;
          var pagenow = queryParmas.currentPage;
          this.handleCurrentChange(pagenow);
          this.currentPage = queryParmas.currentPage;
        }
      }
    }
  };
</script>

<style lang="scss">
  // header
  header {
    padding: 50px 0;

    .formInputCss {
      width: 180px;
      margin-right: 20px;
    }

    .formLabelCss {
      padding: 0 10px;
    }

    .searchBtn {
      margin-left: 30px;
    }
  }


  .excelBtn {
    //float:right

  }

  .batchOp {
    float: right
  }


  // nav
  nav {
    //padding: 10px 0;
    //margin-bottom: 10px;
    .excelBtn {
      float: right
    }
  }

  // main
  main {
    .pagination {
      float: right;
      padding: 30px 0;
    }

  }

  .importExcel {


  }

  .tableHeader {
    color: #000;
  }

  div.list {
    width: 90%;
    margin: 0 auto;
  }

  .addArea .el-input {
    width: 200px;
  }

  .addForm {
    overflow: hidden;
  }

  .addForm .el-form-item {
    float: left;
  }

  .sexArea {
    width: 200px;
  }

  .addFormArea {
    .el-dialog__body {
      height: 350px;
    }

    .el-dialog__header .el-dialog__title {
      text-align: left;
    }
  }

  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

  .drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
</style>

<!--input：-->
<!--resize	控制是否能被用户缩放-->
<!--autocomplete	原生属性，自动补全-->
<!--rows	输入框行数，只对 type="textarea" 有效-->
<!--placeholder	输入框占位文本-->
<!--clearable	是否可清空-->
<!--disabled	禁用-->
<!--value / v-model	绑定值-->
<!--show-password	是否显示切换密码图标-->
<!--prefix-icon	输入框头部图标-->
<!--suffix-icon	输入框尾部图标-->
<!--event：-->
<!--blur	在 Input 失去焦点时触发	(event: Event)-->
<!--focus	在 Input 获得焦点时触发	(event: Event)-->
<!--change	在 Input 值改变时触发	(value: string | number)-->
<!--clear	在点击由 clearable 属性生成的清空按钮时触发-->

<!--v-bind v-model-->
<!--加冒号的，说明后面的是一个变量或者表达式；没加冒号的后面就是对应的字符串字面量！省v-bind-->
<!--<p v-bind:class="someclass"></p>-->
<!--1-->
<!--如果不加 v-bind 那么 someclass 就是个常量，没有任何动态数据参与。当加上 v-bind 之后，它的值 someclass 不是字符串，而是vue实例对应的 data.someclass 这个变量-->
<!--@：省v-on：监听事件-->
