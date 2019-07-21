<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h3 class="title">Welcome !</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input ref="username" v-model="loginForm.username" clearable placeholder="Username"
          name="username" type="text" tabindex="1" auto-complete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" clearable
            :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on"
            @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
  import {validUsername} from '../utils/validate'
  import request from '../utils/request';
  import {setCookie, getCookie} from '../utils/auth'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!validUsername(value)) {
          callback(new Error('Please enter the user name'))
        } else {
          callback()
        }
      };
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      };
      return {
        loginUrl: "./login",
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,

      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
      this.loginForm.username = getCookie().userName;
      this.loginForm.password = getCookie().passWord;
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },

      handleLogin() {
        const self = this;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            //console.log(this.loginForm)
            request({
              url: this.loginUrl,
              method: "post",
              data: this.loginForm,
            })
              .then(response => {
                // console.log(response)
                if (response.data.status == 'success') {
                  setCookie(self.loginForm.username, self.loginForm.password, 1);
                  console.log("登录成功")
                  this.$store.commit('user/SET_NAME', response.data.results.username)
                  this.$store.commit('user/SET_ROLES', response.data.results.role)
                  localStorage.setItem("roles",response.data.results.role)
                  this.$store.commit('user/SET_TOKEN', response.data.token)
                  setTimeout(function () {
                    self.$router.push({path: "/dashboard"})
                  }, 300)
                } else {
                  console.log("登录失败")
                  alert("用户名或密码错误，请重新输入！")
                }

              })
              .catch((error) => {
                console.log(error)
              });
          } else {
            console.log("不请求")
          }
        })
      },
    }
  }

</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;


      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" rel="stylesheet/scss" scoped>

  .login-container {
    min-height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
    background-image: url("../assets/bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    position: fixed;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      /*color: $dark_gray;*/
      color: #000;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: #000;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #000;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
