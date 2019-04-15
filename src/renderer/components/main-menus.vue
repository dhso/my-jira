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
        <span slot="title">Issues</span>
        <el-menu-item index="2_1">
          TBD
        </el-menu-item>
        <el-menu-item index="2_2">
          In Development
        </el-menu-item>
        <el-menu-item index="2_3">
          <span slot="title">Ready to Test</span>
        </el-menu-item>
        <el-menu-item index="2_4">
          <span slot="title">In Testing</span>
        </el-menu-item>
        <el-menu-item index="2_5">
          <span slot="title">Done</span>
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Bugs">
        <el-menu-item index="2_6">
          <span slot="title">Open, Reopened</span>
        </el-menu-item>
        <el-menu-item index="2_7">
          <span slot="title">In Progress</span>
        </el-menu-item>
        <el-menu-item index="2_8">
          <span slot="title">Resolved</span>
        </el-menu-item>
        <el-menu-item index="2_9">
          <span slot="title">Closed</span>
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
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'TBD' } })
    },
    act_2_2() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'In Development' } })
    },
    act_2_3() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'Ready to Test' } })
    },
    act_2_4() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'In Testing' } })
    },
    act_2_5() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'Done' } })
    },
    act_2_6() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'Open, Reopened' } })
    },
    act_2_7() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'In Progress' } })
    },
    act_2_8() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'Resolved' } })
    },
    act_2_9() {
      this.$router.push({ name: 'my-issues', query: { issueStatus: 'Closed' } })
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
          this.$message.info('已清除缓存，成功退出')
          // 跳转登录
          this.$router.replace({ name: 'login-page' })
        })
        .catch(() => {})
    }
  }
}
</script>

