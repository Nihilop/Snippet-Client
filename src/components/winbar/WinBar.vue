<template>
<header id="titlebar">
  <div id="drag-region">
    <img :src="ico">
    <p id="win_title">
      {{ title }}
    </p>
    <div id="win_controls">
      <winBarBtn />
    </div>
  </div>
</header>
</template>

<script>
import winBarBtn from './WinBarBtn'
import {
  isElectron
} from 'environ'
// require('@/renderer')

export default {
  name: 'Winbar',
  components: {
    winBarBtn
  },
  props: ['ico', 'title'],
  methods: {
    isDevice () {
      if (isElectron()) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/variables.scss';

#titlebar {
  position:relative;
  height: 28px;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  background: transparent !important;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  z-index: 9999;

  #drag-region {
    position: relative;
    display: flex;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    -webkit-app-region: drag;

    img {
      height: calc(100% - 3px);
      padding: 3px;
      margin: 3px 5px;
      float: left;
    }

    #win_title {
      font-size: 10px;
      padding: 0;
      margin: auto 0;
      width: fit-content;
    }

    #win_controls {
      margin:auto 0 auto auto;
      height: 100%;
      -webkit-app-region: no-drag;
      width: fit-content;
      display:flex;
      vertical-align:middle;
    }
  }
}

// if win is maximized
.maximized #titlebar {
  width: 100%;
}
</style>
