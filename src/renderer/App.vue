<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-jira'
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
