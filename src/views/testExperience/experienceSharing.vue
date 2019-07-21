<template>
  <div>
 <el-upload
  class="upload-file"
  drag
  :action="doUpload"
  :show-file-list="true"
  :data="pppss">
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
</el-upload>
  </div>
</template>

<script>
  //import axios from 'axios'
    export default {
        name: "experienceSharing",
      data() {
        return {
          doUpload: '10.199.0.187/home/wangqiao/file'
          , pppss: {
            srid: ''
          }
        }
      }
    }
</script>

<style scoped>

</style>
