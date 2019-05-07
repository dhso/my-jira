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
    <el-menu-item index="3">
      <i class="el-icon-setting" />
      <span slot="title">设置</span>
    </el-menu-item>
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
    act_3() {
      this.$router.push({ name: 'my-settings' })
    }
  }
}
</script>

