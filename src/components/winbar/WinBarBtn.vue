<template>
<div class="winBarBtn">
  <div class="button" @click="onMinimize">
    <span>
      <LineHorizontal120Regular />
    </span>
  </div>
  <div class="button" @click="onMaximize">
    <span class="maxMin">
      <FullScreenMinimize24Regular v-if="fullscreen" />
      <FullScreenMaximize20Regular  v-else />
    </span>
  </div>
  <div class="button close" @click="onClose">
    <span class="closed">
      <Dismiss20Regular />
    </span>
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { FullScreenMaximize20Regular, FullScreenMinimize24Regular, LineHorizontal120Regular, Dismiss20Regular } from '@vicons/fluent'

const { remote, ipcRenderer } = window.require ? window.require('electron') : null
const win = window.require ? remote.getCurrentWindow() : null

export default {
  name: 'WinBarBtn',
  components: {
    FullScreenMaximize20Regular,
    FullScreenMinimize24Regular,
    LineHorizontal120Regular,
    Dismiss20Regular
  },
  setup () {
    const fullscreen = ref(null)

    function onClose () {
      ipcRenderer.send('close')
    }

    function onMinimize () {
      ipcRenderer.send('min')
    }

    function onMaximize () {
      ipcRenderer.send('max')
      if (win.isMaximized()) {
        this.fullscreen = true
      } else {
        this.fullscreen = false
      }
    }
    return {
      fullscreen,
      onClose,
      onMinimize,
      onMaximize
    }
  }
}
</script>

<style lang="scss" scoped>
.winBarBtn {
  margin:auto;
  flex-grow: 1;
  display: flex;

  .button {
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 12pt;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin:auto 5px;
  }

  .button
    > span {
    flex-grow: 1;
    user-select: none;
    margin:auto 3px;
  }

  .button>.maxMin {
    font-size: 0.6em;
  }

}
</style>
