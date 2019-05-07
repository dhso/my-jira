<template>
  <div v-loading="isLoading" class="main-page" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="side-bar">
      <div class="my-avatar">
        <el-image class="my-avatar-image" :src="currentUser && currentUser.avatarUrls['48x48']" fit="cover">
          <i slot="placeholder" class="el-icon-loading" />
          <i slot="error" class="el-icon-user-solid" />
        </el-image>
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
      this.$message({ message: `${err.statusCode}:${err.name}`, type: 'error' })
      // 跳转登录
      this.$router.replace({ name: 'login-page' })
    } finally {
      setTimeout(() => {
        this.isLoading = false
        this.loadingText = null
      }, 200)
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
      color: #fff;
      .my-avatar-image img{
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
.el-table .el-table__header th.is-leaf {
  background-color: #f5f7fa;
  color: #606266;
}
</style>
