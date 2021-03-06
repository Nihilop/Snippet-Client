<template>
  <n-config-provider :hljs="hljs" :theme-overrides="themeOverrides" :theme="theme === 'light' ? null : globalTheme" :class="theme === 'light' ? 'light' : 'dark'">
    <n-global-style />
    <n-notification-provider>
      <n-message-provider>
        <n-layout-header class="titlebar" position="absolute" style="width:100%;" height="28px" v-if="isApp">
          <component :is="winBar" title="App" v-if="isApp"/>
        </n-layout-header>
        <div class="loader" v-if="!isLoaded">
          <n-spin class="spinner" size="large" />
        </div>
        <n-layout position="absolute" class="default_container" content-style="min-height:100%" :style="isApp ? 'top:28px' : null" :native-scrollbar="false" v-if="isLoaded">
          <router-view />
        </n-layout>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect, computed, defineAsyncComponent } from 'vue'
import hljs from 'highlight.js/lib/core'
import { darkTheme, NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NSpin, NNotificationProvider, NMessageProvider } from 'naive-ui'
// import winBar from '@/components/winbar/WinBar'
import { useStore } from 'vuex'
import { isElectron } from 'environ'
import javascript from 'highlight.js/lib/languages/javascript'
const isApp = ref(isElectron())
hljs.registerLanguage('javascript', javascript)

export default defineComponent({
  components: {
    NConfigProvider,
    NLayoutHeader,
    NGlobalStyle,
    NLayout,
    NSpin,
    NNotificationProvider,
    NMessageProvider
  },
  computed: {
    winBar () {
      return defineAsyncComponent(() =>
        import('@/components/winbar/WinBar.vue')
      )
    }
  },
  mounted () {
    if (!localStorage.lang || localStorage.lang === 'null') {
      localStorage.lang = 'fr'
      this.$i18n.locale = localStorage.lang
    } else {
      this.$i18n.locale = localStorage.lang
    }
  },
  setup () {
    const store = useStore()
    const theme = ref(null)
    const isLoaded = ref(false)
    const globalTheme = ref(darkTheme)
    const themeColor = ref(null)
    const loggedIn = computed(() => {
      return store.state.auth.status.loggedIn
    })
    const themeOverrides = ref({
      common: {
        primaryColor: null || '#3498db',
        primaryColorHover: null || '#3498db',
        primaryColorPressed: null || '#3498db',
        primaryColorSuppl: null || '#3498db'
      }
    })
    onMounted(() => {
      if (loggedIn.value) {
        store.dispatch('user/currentUser')
      }
      store.dispatch('CHANGE_THEME', localStorage.theme)
      setTimeout(() => {
        isLoaded.value = true
      }, 2000)
      if (isApp.value) {
        document.body.classList.add('application')
      } else {
        document.body.classList.add('browser')
      }
    })
    watchEffect(() => {
      theme.value = store.state.themeColor
      if (loggedIn.value && store.state.user.currentUser !== '') {
        setTimeout(() => {
          themeColor.value = store.state.user.currentUser.settings.color
          themeOverrides.value.common.primaryColor = themeColor.value
          themeOverrides.value.common.primaryColorHover = themeColor.value
          themeOverrides.value.common.primaryColorPressed = themeColor.value
          themeOverrides.value.common.primaryColorSuppl = themeColor.value
        }, 1000)
      }
    })
    return {
      isApp,
      isLoaded,
      theme,
      themeOverrides,
      globalTheme,
      hljs
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/style/variables.scss';
// @import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.9.5/tailwind.min.css';

.noSelect {
  user-select: none;
}

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
