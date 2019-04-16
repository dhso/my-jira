<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'my-jira',
  data() {
    return {}
  },
  mounted() {
    const { ipcRenderer } = this.$electron
    // update available
    ipcRenderer.on('updater:event:update-available', () => {
      this.$confirm('发现新版本, 是否升级?', '升级提示', {
        confirmButtonText: '升级',
        cancelButtonText: '暂不',
        type: 'warning'
      }).then(() => {
        ipcRenderer.send('updater:method:downloadUpdate')
      })
    })
    // updater downloading
    ipcRenderer.on('updater:event:update-downloading', meta => {
      console.log(meta)
      this.$notify.info({ title: '升级', message: '正在下载升级包，请耐心等待.' })
    })
    // updater downloading
    ipcRenderer.on('updater:event:update-downloaded', meta => {
      console.log(meta)
      this.$notify.info({ title: '升级', message: '升级包下载完成,请退出程序来完成安装.' })
      setTimeout(() => {
        ipcRenderer.send('updater:method:quitAndInstall')
      }, 1000)
    })
    // updater error
    ipcRenderer.on('updater:event:error', error => {
      this.$notify.error({ title: '升级', message: error })
    })
    // updater checkForUpdates
    ipcRenderer.send('updater:method:checkForUpdates')
  }
}
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
* {
  outline: none;
  box-sizing: border-box;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
