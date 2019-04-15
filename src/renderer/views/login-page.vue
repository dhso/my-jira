<template>
  <div class="login-page">
    <el-form
      ref="loginInfoForm"
      :model="loginInfoForm"
      :rules="loginInfoRules"
      label-width="100px"
      :hide-required-asterisk="true"
      class="login-info-form"
    >
      <el-form-item>
        <h2>My Jira</h2>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="username"
      >
        <el-input
          v-model="loginInfoForm.username"
          clearable
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item
        label="密钥"
        prop="password"
      >
        <el-input
          v-model="loginInfoForm.password"
          type="password"
          clearable
          placeholder="请输入密钥"
        />
      </el-form-item>
      <el-form-item
        label="域名"
        prop="fullHost"
      >
        <el-input
          v-model="loginInfoForm.fullHost"
          clearable
          placeholder="请输入域名"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="text"
          @click="generateTokenHandler"
        >
          点击此处管理登录密钥
        </el-button>
      </el-form-item>
      <el-form-item class="action-buttons">
        <el-button
          type="primary"
          :loading="isLoading"
          @click="submitForm('loginInfoForm')"
        >
          立即登录
        </el-button>
        <el-button @click="resetForm('loginInfoForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <video
      muted
      autoplay="autoplay"
      loop="loop"
    >
      <source src="http://cdn.moji.com/websrc/video/video621.mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: 'login-page',
  data() {
    return {
      loginInfoForm: {
        username: null,
        password: null,
        fullHost: 'https://patsnap.atlassian.net'
      },
      isLoading: false
    }
  },
  created() {
    this.loginInfoRules = {
      username: [{ required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密钥', trigger: 'blur' }],
      fullHost: [{ required: true, type: 'url', message: '请输入域名', trigger: 'blur' }]
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return false
        // 储存登录信息
        this.$stores.set('system.loginInfo', this.loginInfoForm)

        // 初始化jira
        const { username, password, fullHost } = this.loginInfoForm
        const [protocol, host] = fullHost.split('://')
        this.$initJira(protocol, host, username, password)

        // 校验用户信息能否登录
        try {
          this.isLoading = true
          this.currentUser = await this.$jira.getCurrentUser()
          // 存储当前用户信息
          this.$stores.set('current.user', this.currentUser)
          this.$message.success(`欢迎回来, ${this.currentUser.displayName}!`)
          // 跳转主页
          this.$router.replace({ name: 'main-page' })
        } catch (error) {
          this.$message.error(`${error.statusCode}:${error.name}`)
        } finally {
          this.isLoading = false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    generateTokenHandler() {
      this.$electron.shell.openExternal('https://id.atlassian.com/manage/api-tokens')
    }
  }
}
</script>

<style lang="scss">
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  .login-info-form {
    width: 520px;
  }
  .action-buttons {
    margin-top: 32px;
  }
  video {
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -9999;
    /*灰色调*/
    -webkit-filter: grayscale(100%);
  }
}
</style>
