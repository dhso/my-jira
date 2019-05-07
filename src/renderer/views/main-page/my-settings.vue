<template>
  <div
    v-loading.fullscreen.lock="isLoading"
    class="my-settings"
  >
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>App</el-breadcrumb-item>
      <el-breadcrumb-item>Settings</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeTabName" tab-position="left" class="settings-card">
      <el-tab-pane label="User Info" name="userInfo">
        <el-form v-if="currentUser" label-width="120px" label-position="left">
          <el-form-item label="Name">
            <span>{{ currentUser.name }}</span>
          </el-form-item>
          <el-form-item label="Email Address">
            <span>{{ currentUser.emailAddress }}</span>
          </el-form-item>
          <el-form-item label="Display Name">
            <span>{{ currentUser.displayName }}</span>
          </el-form-item>
          <el-form-item label="TimeZone">
            <span>{{ currentUser.timeZone }}</span>
          </el-form-item>
          <el-form-item label="Locale">
            <span>{{ currentUser.locale }}</span>
          </el-form-item>
          <el-form-item label="Active">
            <span>{{ currentUser.active }}</span>
          </el-form-item>
        </el-form>
        <el-button type="danger" round @click="logoutHandler">
          登出账号
        </el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'my-settings',
  data() {
    return {
      isLoading: false,
      activeTabName: 'userInfo'
    }
  },
  created() {
    console.log('my settings')
    this.currentUser = this.$stores.get('current.user')
  },
  methods: {
    logoutHandler(){
      this.$confirm('账号即将登出, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 清除缓存
          this.$stores.clear()
          this.$message({ message: '已清除缓存，成功退出.', type: 'info' })
          // 跳转登录
          this.$router.replace({ name: 'login-page' })
        })
        .catch(() => {})
    }
  },
}
</script>

<style lang="scss">
.my-settings {
  .settings-card{
    margin-top: 40px;
    height: calc(100vh - 106px);
    .el-tabs__content {
      padding: 16px;
    }
  }
}
</style>
