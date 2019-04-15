<template>
  <div v-loading="isLoading" class="main-page" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="side-bar">
      <div class="my-avatar">
        <el-popover :disabled="!currentUser" placement="right" trigger="hover" width="400">
          <el-form v-if="currentUser" label-width="120px" label-position="left">
            <el-form-item label="Name">
              <span class="avatar-popover-text">{{ currentUser.name }}</span>
            </el-form-item>
            <el-form-item label="Email Address">
              <span class="avatar-popover-text">{{ currentUser.emailAddress }}</span>
            </el-form-item>
            <el-form-item label="Display Name">
              <span class="avatar-popover-text">{{ currentUser.displayName }}</span>
            </el-form-item>
            <el-form-item label="TimeZone">
              <span class="avatar-popover-text">{{ currentUser.timeZone }}</span>
            </el-form-item>
            <el-form-item label="Locale">
              <span class="avatar-popover-text">{{ currentUser.locale }}</span>
            </el-form-item>
            <el-form-item label="Active">
              <span class="avatar-popover-text">{{ currentUser.active }}</span>
            </el-form-item>
          </el-form>
          <el-button type="danger" class="avatar-popover-logout" @click="logoutHandler">
            Logout
          </el-button>
          <img slot="reference" :src="currentUser && currentUser.avatarUrls['48x48']">
        </el-popover>
      </div>
      <main-menus />
    </div>
    <router-view class="view-container" />
  </div>
</template>

<script>
import MainMenus from '@/components/main-menus'

export default {
  name: 'main-page',
  components: {
    'main-menus': MainMenus
  },
  data() {
    return {
      isCollapse: true,
      currentUser: null,
      isLoading: false,
      loadingText: null
    }
  },
  async created() {
    console.log('main page')
    try {
      // 初始化jira
      const { username, password, fullHost } = this.$stores.get('system.loginInfo')
      const [protocol, host] = fullHost.split('://')
      this.$initJira(protocol, host, username, password)
      // 校验用户
      this.loadingText = '校验用户中'
      this.isLoading = true
      this.currentUser = await this.$jira.getCurrentUser()
      this.loadingText = '校验成功'
      // 存储当前用户
      this.$stores.set('current.user', this.currentUser)
    } catch (err) {
      console.log(err)
      this.loadingText = '校验失败'
      this.$message.error(`${err.statusCode}:${err.name}`)
      // 跳转登录
      this.gotoLoginPage()
    } finally {
      setTimeout(() => {
        this.isLoading = false
        this.loadingText = null
      }, 200)
    }
  },
  methods: {
    logoutHandler() {
      // 清除缓存
      this.$stores.clear()
      this.$message.info('已清除缓存，成功退出')
      // 跳转登录
      this.gotoLoginPage()
    },
    gotoLoginPage() {
      this.$router.replace({ name: 'login-page' })
    }
  }
}
</script>

<style lang="scss">
.main-page {
  display: flex;
  .side-bar {
    height: 100vh;
    background-color: rgb(84, 92, 100);
    width: 64px;
    border-right: solid 1px #e6e6e6;
    .my-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 68px;
      img {
        border-radius: 2px;
        width: 48px;
        height: 48px;
      }
    }
    .side-menus {
      height: calc(100vh - 68px);
      overflow: auto;
    }
  }
  .view-container {
    position: relative;
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    & > .el-breadcrumb {
      margin-bottom: 20px;
    }
  }
}
.avatar-popover {
  &-text {
    color: #333;
    font-weight: 600;
  }
  &-logout {
    float: right;
    margin: 10px 20px;
  }
}
</style>
