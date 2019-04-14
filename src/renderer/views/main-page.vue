<template>
  <div class="main-page" v-loading="isLoading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
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
          <el-button type="danger" class="avatar-popover-logout" @click="logoutHandler">Logout</el-button>
          <img :src="currentUser && currentUser.avatarUrls['48x48']" slot="reference" />
        </el-popover>
      </div>
      <el-menu :collapse="isCollapse" default-active="1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="side-menus" :router="true">
        <el-menu-item index="1" :route="{ name: 'my-dashboard' }">
          <i class="el-icon-menu"></i>
          <span slot="title">面板</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-tickets"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">Issues</span>
            <el-menu-item index="2-1" :route="{ name: 'my-issues', query: { issueStatus: 'TBD' } }">TBD</el-menu-item>
            <el-menu-item index="2-2" :route="{ name: 'my-issues', query: { issueStatus: 'In Development' } }">In Development</el-menu-item>
            <el-menu-item index="2-3" :route="{ name: 'my-issues', query: { issueStatus: 'Done' } }">Done</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Bugs">
            <el-menu-item index="2-4" :route="{ name: 'my-issues', query: { issueStatus: 'Open' } }">Open</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" :route="{ name: 'my-overtime' }">
          <i class="el-icon-date"></i>
          <span slot="title">Overtime</span>
        </el-menu-item>
        <!-- <el-menu-item index="4" :route="{ name: 'my-settings' }">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item> -->
      </el-menu>
    </div>
    <router-view class="view-container"></router-view>
  </div>
</template>

<script>
export default {
  name: 'main-page',
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
