<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" size="large" class="login-form">
      <h3 class="title">
        {{ projectName }}
      </h3>
      <el-form-item label="" prop="account">
        <base-input v-model.trim="loginForm.account" placeholder="账号" />
      </el-form-item>
      <el-form-item label="" prop="password">
        <base-input v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter.native="handleLogin" />
      </el-form-item>
      <!--<el-form-item label="" prop="code_token_value">
          <div style="position: relative;display: flex">
            <base-input v-model="loginForm.code_token_value" style="flex: 1;" placeholder="验证码" @keyup.enter.native="handleLogin" />
            <img
              :key="loginForm.code_token"
              title="点击更换验证码"
              alt="验证码"
              :src="verifyCodeSrc + loginForm.code_token"
              height="40px"
              width="84px"
              style="cursor: pointer;"
              @click="getCode"
            >
          </div>
        </el-form-item>-->
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      verifyCodeSrc: process.env.VUE_APP_BASE_API + '/verify/code/admin/bean/',
      loginForm: {
        account: '',
        password: '',
        code_token: this.getRandom(),
        code_token_value: ''
      },
      loginRules: {
        account: [{ required: true, message: '账号不能为空' }],
        password: [{ required: true, message: '密码不能为空' }],
        code_token_value: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters(['projectName'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    getCode() {
      this.loginForm.code_token = this.getRandom()
    },
    getRandom() {
      return Math.random().toString(32).slice(2, 8)
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            await this.$store.dispatch('Login', this.loginForm)
            await this.$store.dispatch('GetMenu', this.loginForm)
            this.loading = false
            this.$router.push({ path: '/' })
          } catch (e) {
            this.getCode()
            this.loginForm.code_token_value = ''
            this.loading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$font-color:#1A99FF;
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  display: flex;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  background-image: url("./../../assets/image/login.png");
  background-size: cover;
  background-repeat: no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 420px;
    max-width: 100%;
    padding: 0 40px;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $font-color;
    text-align: center;
    font-weight: bold;
  }
}
</style>
