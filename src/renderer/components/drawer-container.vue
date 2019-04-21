<template>
  <div :class="['drawer-container', { 'drawer-visible': visible }]" v-on="$listeners">
    <div class="drawer-container-content" :style="{ width: width }">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'drawer-container',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '80%'
    }
  }
}
</script>

<style lang="scss">
.drawer-container {
  z-index: 2001;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.3);
  &.drawer-visible {
    visibility: visible;
    .drawer-container-content {
      transform: translateX(0);
    }
  }
  .drawer-container-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    transform: translateX(100%);
    background-color: #fff;
    transition: transform ease-in-out 0.3s, visibility 0.3s;
    box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.15);
    padding: 16px;
  }
}
</style>


