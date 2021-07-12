<template>
  <n-config-provider :hljs="hljs" :theme-overrides="themeOverrides" :theme="themeColor === 'light' ? null : globalTheme" :class="themeColor === 'light' ? 'light' : 'dark'">
    <n-global-style />
    <n-notification-provider>
      <n-message-provider>
        <n-layout-header class="titlebar" position="absolute" style="width:100%;" height="28px" v-if="isElectron">
          <win-bar title="App" />
        </n-layout-header>
        <div class="loader" v-if="!isLoaded">
          <n-spin class="spinner" size="large" />
        </div>
        <n-layout position="absolute" class="default_container" content-style="min-height:100%" :style="isElectron ? 'top:28px' : null" :native-scrollbar="false" v-if="isLoaded">
          <router-view />
        </n-layout>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect } from 'vue'
import hljs from 'highlight.js/lib/core'
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NSpin, NNotificationProvider, NMessageProvider } from 'naive-ui'
import { isElectron } from 'environ'
import winBar from '@/components/winbar/WinBar'
import { useStore } from 'vuex'

import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)

export default defineComponent({
  components: {
    NConfigProvider,
    NLayoutHeader,
    NGlobalStyle,
    NLayout,
    NSpin,
    NNotificationProvider,
    NMessageProvider,
    winBar
  },
  data () {
    return {
      isElectron: null
    }
  },
  created () {
    // Sans doute en faire une global var pour pouvoir utiliser cette condition partout dans l'app avec $isElectron
    this.isElectron = isElectron()
    if (isElectron()) {
      document.body.classList.add('application')
    } else {
      document.body.classList.add('browser')
    }
  },
  setup () {
    const store = useStore()
    const themeColor = ref(null)
    const isLoaded = ref(false)
    const globalTheme = ref(darkTheme)
    const themeOverrides = ref({
      common: {
        primaryColor: store.state.primaryColor || '#3E7CB1FF',
        primaryColorHover: store.state.primaryColor || '#2B699FFF',
        primaryColorPressed: store.state.primaryColor || '#4B88BBFF',
        primaryColorSuppl: store.state.primaryColor || '#81A4CDFF'
      }
    })
    onMounted(() => {
      store.dispatch('CHANGE_THEME', localStorage.theme)
      setTimeout(() => {
        isLoaded.value = true
      }, 2000)
    })
    watchEffect(() => {
      themeColor.value = store.state.themeColor

      themeOverrides.value.common.primaryColor = store.state.primaryColor
      themeOverrides.value.common.primaryColorHover = store.state.primaryColor
      themeOverrides.value.common.primaryColorPressed = store.state.primaryColor
      themeOverrides.value.common.primaryColorSuppl = store.state.primaryColor
    })
    return {
      isLoaded,
      themeColor,
      themeOverrides,
      globalTheme,
      hljs
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/style/variables.scss';
@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.9.5/tailwind.min.css';

.titlebar {
  display: block;
}
.loader {
  display:flex;
  width:100%;
  height: 100vh;
  vertical-align: middle;
  justify-content: center;
  .spinner {
    margin:auto;
  }
}
.default_container {
  display: flex;
  width: 100%;
  height: calc(100% - 28px);
  vertical-align:middle;
  justify-content: center;
  background: transparent;
}

.browser {
  .default_container {
    height: 100% !important;
  }
}

</style>
