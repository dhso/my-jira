<template>
  <el-menu default-active="1" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" class="side-menus" collapse @select="selectHandler">
    <el-menu-item index="1">
      <i class="el-icon-menu" />
      <span slot="title">面板</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-tickets" />
        <span slot="title">Jira</span>
      </template>
      <el-menu-item-group>
        <span slot="title">Jira</span>
        <el-menu-item index="2_1">
          My Issues
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-date" />
        <span slot="title">加班</span>
      </template>
      <el-menu-item-group title="加班">
        <el-menu-item index="3_1">
          <span slot="title">打卡</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-setting" />
        <span slot="title">设置</span>
      </template>
      <el-menu-item-group title="账号">
        <el-menu-item index="4_1">
          <span slot="title">登出</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'main-menus',
  data() {
    return {}
  },
  methods: {
    selectHandler(index) {
      this[`act_${index}`]()
    },
    act_1() {
      this.$router.push({ name: 'my-dashboard' })
    },
    act_2_1() {
      this.$router.push({ name: 'my-issues' })
    },
    act_3_1() {
      this.$router.push({ name: 'my-overtime' })
    },
    act_4_1() {
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
  }
}
</script>

