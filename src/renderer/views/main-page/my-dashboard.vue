<template>
  <div v-loading="isLoading" class="my-dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>Notification</el-breadcrumb-item>
    </el-breadcrumb>
    这里放公告信息
  </div>
</template>

<script>
export default {
  name: 'my-dashboard',
  data() {
    return {
      isLoading: false
    }
  },
  created() {
    console.log('my dashboard')
  },
  methods: {}
}
</script>

<style lang="scss">
.my-dashboard {
}
</style>
