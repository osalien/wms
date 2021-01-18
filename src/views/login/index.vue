<template>
    <div class="login-container">
      <div class="login-all">
      <div class="login-left" ></div>
      <div class="login-right">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">华思颖业SIT</h3>
        <h3 class="sub-title">   </h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.userName"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <div style="float: left;width:64%">
        <el-tooltip content="Caps lock is On" placement="right" manual style="margin-bottom: 0px !important;">
          <el-form-item prop="verification">
            <span class="svg-container">
              <svg-icon icon-class="yzm" style="margin-left: -2px;height: 19px;width: 19px;" />
            </span>
            <el-input
              ref="verification"
              v-model="loginForm.verification"
              placeholder="验证码"
              name="verification"
              tabindex="3"
            />
          </el-form-item>
        </el-tooltip>
      </div>
      <div style="float: right;">
        <el-tooltip content="Bottom center" placement="bottom" effect="light">
          <img :src="verificationPic">
        </el-tooltip>
      </div>
      <div style="margin-top: 22px;float:left;position:relative">
        <div class="tips">
          <el-checkbox v-model="rememberChecked">记住我</el-checkbox>
        </div>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin:20px 0px; border:0px;background-color:#CD5C5C" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
      </div>
      </div>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import {Message} from "element-ui";
const Base64 = require('js-base64').Base64

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value=='') {
        callback(new Error('请填写用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value=='') {
        callback(new Error('请输入密码'))
      } else if(value.length<6){
        callback(new Error('密码长度最低为6位'))
      }else{
        callback()
      }
    }
    const validateVerification = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        uesrName: '',
        password: '',
        verification: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verification: [{ required: true, trigger: 'blur', validator: validateVerification }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      rememberChecked: false,
      verificationPic: 'https://camo.githubusercontent.com/e9acc0d4254ef2e21856d5a1c5e4f7e79251aed35f0b34918d7673f343619386/68747470733a2f2f73322e617831782e636f6d2f323031392f30382f32332f6d736b6d61382e706e67'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // 在页面加载时从cookie获取登录信息
    const username = this.getCookie('username')
    const password = Base64.decode(this.getCookie('password'))
    // 如果存在赋值给表单，并且将记住密码勾选
    if (username) {
      this.loginForm.username = username
      this.loginForm.password = password
      this.rememberChecked = true
    }
  },
  mounted() {
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
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
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
      var data = {
        // grant_type: 'password',
        username: this.loginForm.uesrName,
        password: this.loginForm.password,
        // ClientId:1,
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            //使用了store下面的user里面的login方法
            .then((res) => {
              this.loading = false
              if(res.msg=='登录成功'){
                debugger
                Message.success(res.msg)
                localStorage.setItem('user',JSON.stringify(res.data))
                // 储存登录信息
                this.setUserInfo()
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              }else{
                Message.error(res.msg)
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 储存表单信息
    setUserInfo: function() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.rememberChecked) {
        this.setCookie('username', this.loginForm.userName)
        // base64加密密码
        const passWord = Base64.encode(this.loginForm.password)
        this.setCookie('password', passWord)
      } else {
        this.setCookie('username', '')
        this.setCookie('password', '')
      }
    },
    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function(cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cName + '=' + decodeURIComponent(value) +
        ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-all{
  width:1024px;
  height:500px;
  margin: 5% auto;
}
.login-left{
  float:left;
  width:50%;
  height:500px;
  background-color:indianred;
  //background-image: url("../../icons/loginlogo.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.login-right{
  background-color: rgba(41, 45, 62, 0.1);
  float:left;
  height:500px;
  width:50%;
}

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

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
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

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#CD5C5C;

.login-container {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to top, #e6b980 0%, #eacda3 100%);
  //background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 10px auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 22px;
    margin-left: 2px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 26px auto;
      text-align: center;
      font-weight: bold;
    }
    .sub-title {
      font-size: 16px;
      margin: 0px auto 26px auto;
      color: $light_gray;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
