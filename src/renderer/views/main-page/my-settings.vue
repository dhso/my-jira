<template>
  <div
    v-loading.fullscreen.lock="isLoading"
    class="my-settings"
  >
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>App</el-breadcrumb-item>
      <el-breadcrumb-item>Settings</el-breadcrumb-item>
    </el-breadcrumb>
    <p>my settings</p>
  </div>
</template>

<script>
export default {
  name: 'my-settings',
  data() {
    return {
      isLoading: false
    }
  },
  created() {
    console.log('my settings')
    this.currentUser = this.$stores.get('current.user')
  }
}
</script>

<style lang="scss">
.my-settings {
}
</style>
