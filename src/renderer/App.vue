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
      this.$notify({ title: '升级', type: 'info', message: '正在下载升级包，请耐心等待.', duration: '0' })
    })
    // updater downloading
    ipcRenderer.on('updater:event:update-downloaded', meta => {
      console.log(meta)
      this.$notify.closeAll()
      this.$notify({
        title: '升级',
        type: 'success',
        message: '升级包下载完成,点击此处完成安装.',
        duration: '0',
        showClose: false,
        onClick: () => {
          ipcRenderer.send('updater:method:quitAndInstall')
        }
      })
    })
    // updater error
    ipcRenderer.on('updater:event:error', error => {
      this.$notify({ title: '升级', type: 'error', message: error, duration: '0' })
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
a,
a:link,
a:visited,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  color: #409eff;
}
a:hover,
a:focus {
  color: #66b1ff;
  border-color: transparent;
  background-color: transparent;
}
.color- {
  &yellow {
    color: #f1c40f;
  }
  &green {
    color: #27ae60;
  }
  &blue-gray {
    color: #2c3e50;
  }
}

.el-table.simple-table {
  &::before {
    display: none;
  }
  td {
    border: none;
  }
}
</style>
