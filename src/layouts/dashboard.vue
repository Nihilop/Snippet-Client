<template>
  <header class="header_bar">
    <transition name="drop-top">
      <div class="download_app" v-if="!isApp && appDlShow">
        <n-icon :size="22" style="margin:0 5px">
          <ArrowDownload24Regular/>
        </n-icon>
        <a href="/download/latest/client_app Setup 0.1.0.exe">{{ $t('global.info_download') }}</a>
        <n-icon :size="18" style="margin: auto auto auto 50px" @click="dismissAppDownload">
          <Dismiss20Regular />
        </n-icon>
      </div>
    </transition>
    <div class="user_container">
      <n-space>
        <n-button text v-if="currentUser.admin" @click="goAdminPage">
          <template #icon>
            <ShieldCheckmark48Regular />
          </template>
          Administration
        </n-button>
        <n-dropdown @select="userOptionSelect" trigger="click" :options="userOptions" placement="bottom-end">
          <n-button text>
            <template #icon>
              <n-avatar style="height:auto;" :src="currentUser.avatar"></n-avatar>
            </template>
            {{ currentUser.name }} <!-- <span class="status" :style="online ? 'background:green' : 'background:red'"></span> -->
          </n-button>
        </n-dropdown>
      </n-space>
    </div>
  </header>
  <n-layout has-sider position="absolute" style="top: 40px">

    <n-layout-sider
      class="sidebarL_servers glass"
      :width="80">
      <!-- sidebar -->
      <n-layout position="absolute" :native-scrollbar="false" style="height:calc(100% - 80px); width:100%;">
        <category-sidebar />
      </n-layout>
      <div style="position:absolute; bottom:0; margin: 0 auto; width:100%; height:80px; display:flex; vertical-align:middle;">
        <n-button text @click="settingsModal = !settingsModal" style="margin:auto">
          <n-icon :size="24">
            <Settings28Filled/>
          </n-icon>
        </n-button>
      </div>
    </n-layout-sider>

    <n-layout has-sider position="absolute" style="left:85px;">
      <transition name="drop-right">
        <n-layout-sider
          v-if="$store.state.project.CIDIsSelected"
          class="sidebarL_options glass"
          :class="windowsWidth <= 380 && $store.state.project.CIDIsSelected ? 'menu--open_mobile' : null"
          :width="windowsWidth <= 380 ? '100%' : 280">
          <!-- sidebar + -->
          <projects-list />
        </n-layout-sider>
      </transition>

      <n-layout ref="container" class="content_wrapper" :class="$store.state.project.CIDIsSelected ? null : 'content_wrapper--mobile'" :native-scrollbar="false" content-style="padding: 34px;">
        <router-view/>
      </n-layout>

    </n-layout>
  </n-layout>

  <!-- modals ? -->
  <n-modal v-model:show="settingsModal" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="settingsModal = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <settings-content />
        <!-- <template #footer> Footer </template> -->
      </n-card>
    </n-layout>
  </n-modal>

</template>
<script>
import { defineComponent, ref, onMounted, watchEffect } from 'vue'
import { NLayout, NLayoutSider, NButton, NIcon, NModal, NCard, NAvatar, NDropdown, useNotification, NSpace } from 'naive-ui'
import { Dismiss20Regular, Settings28Filled, ShieldCheckmark48Regular, ArrowDownload24Regular } from '@vicons/fluent'
import { useStore } from 'vuex'
import router from '@/router'
import { useI18n } from 'vue-i18n'
// Component
import SettingsContent from '@/components/SettingsContent.vue'
import ProjectsList from '@/components/ProjectsList.vue'
import CategorySidebar from '@/components/CategorySidebar.vue'
import { isElectron } from 'environ'
const isApp = ref(isElectron())
export default defineComponent({
  components: {
    // Components:
    SettingsContent,
    ProjectsList,
    CategorySidebar,
    // NaiveUI:
    NLayout,
    NLayoutSider,
    NButton,
    NIcon,
    NModal,
    NCard,
    NAvatar,
    NDropdown,
    NSpace,
    // Icons:
    Dismiss20Regular,
    Settings28Filled,
    ShieldCheckmark48Regular,
    ArrowDownload24Regular
  },
  setup () {
    // Options for electron titlebar
    const store = useStore()
    const settingsModal = ref(false)
    const currentUser = ref(null)
    const appDlShow = ref(true)
    const windowsWidth = ref(window.innerWidth)
    const notification = useNotification()
    const { t } = useI18n({ useScope: 'global' })
    const dropdownUserOptions = ref({
      settings: t('utils.parameters'),
      disconnect: t('utils.disconnect')
    })
    onMounted(() => {
      window.onresize = () => { windowsWidth.value = window.innerWidth }
      store.dispatch('user/currentUser').catch(e => {
        console.log(e)
      })
      setTimeout(() => {
        if (!currentUser.value || currentUser.value === null || currentUser.value === undefined) {
          notification.error({
            content: 'API Error',
            meta: "Nous ne parvenons pas à trouver vos informations.. vous allez être redirigé à la page d'authentification dans 2 secondes",
            duration: 5000
          })
          setTimeout(() => {
            logout()
          }, 2000)
        }
      }, 1000)
    })

    function logout () {
      notification.warning({
        content: 'Deconnexion réussie',
        duration: 5000
      })
      console.log('deco')
      store.dispatch('auth/logout')
      router.push('/login')
    }

    function goAdminPage () {
      router.push('/admin')
      store.dispatch('project/RESET_ALL')
    }

    function dismissAppDownload () {
      appDlShow.value = false
    }

    watchEffect(() => {
      // console.log(`Categorie: ${store.state.CIDIsSelected} & project: ${store.state.PIDIsSelected}`)
      currentUser.value = store.state.user.currentUser
    })

    return {
      goAdminPage,
      dismissAppDownload,
      appDlShow,
      isApp,
      windowsWidth,
      settingsModal,
      currentUser,
      online: true,
      userOptions: [
        {
          label: 'Github',
          key: 1
        },
        {
          label: dropdownUserOptions.value.settings,
          key: 2
        },
        {
          type: 'divider',
          key: 'divier'
        },
        {
          label: dropdownUserOptions.value.disconnect,
          key: 'disconnect'
        }
      ],
      userOptionSelect (key) {
        if (key === 1) {
          console.log('open nav to github')
        } if (key === 2) {
          settingsModal.value = true
        } if (key === 'disconnect') {
          logout()
        }
      }
    }
  }
})
</script>
<style lang="scss">
@import '@/assets/style/variables.scss';
@import '@/assets/style/animations.scss';
@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.9.5/tailwind.min.css';

  .content_wrapper {
    transition: all 0.5s;
    margin:0;
    &.content_wrapper--mobile {
      border-top-left-radius:8px;
      border-bottom-left-radius:0;
    }
  }
  .sidebarL_servers {
    transition: all 0.5s;
    display:block;
    margin:0;
    border-bottom-right-radius:0;
    border-top-right-radius:8px;
  }
  .sidebarL_options {
    display:block;
    margin:0;
    transition: all 0.5s;
    overflow:hidden;
    border-top-left-radius:8px;
    &.menu--open_mobile {
      border-top-left-radius:8px;
      border-bottom-left-radius:8px;
    }
  }

  .header_bar {
    width: 100%;
    height: 40px;
    display: flex;
    vertical-align: middle;
    .download_app {
      margin:auto auto auto 3% ;
      display: flex;
      background: #f1c40f;
      padding: 8px 24px;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #e67e22;
      color: #34495e
    }
    .user_container {
      margin:auto 3% auto auto;
      display: flex;
      vertical-align: middle;
      .status {
        margin:auto 5px;
        width:7px;
        height: 7px;
        border-radius: 50%;
      }
    }
  }

  .modalCard {
    border-radius: 12px;
  }

  .modalClose {
    position:fixed;
    right: 2%
  }

  .browser {
    .sidebarL_servers, .sidebarL_options, .sidebarL_options, .content_wrapper {
      margin: 20px 0 0 0 !important;
    }
    .header_bar {
      height: 60px;
    }
  }

  .dark {
    .sidebarL_options, .sidebarL_servers {
      background-color: rgba($backgroundDark-secondary, 40%);
    }
    .content_wrapper {
      background: #36393F ;
    }
    .searchIn {
      background-color: rgba($backgroundDark-secondary, 50%);
      box-shadow:rgba(4, 4, 5, 0.2) 0px 1px 0px 0px, rgba(6, 6, 7, 0.05) 0px 1.5px 0px 0px, rgba(4, 4, 5, 0.05) 0px 2px 0px 0px;
    }
    .PIDLink {
      background: rgba(#36393F, 90%);
    }
  }
  .light {
    .sidebarL_options, .sidebarL_servers {
      background-color: $backgroundLight-secondary;
    }
    .content_wrapper {
      background: darken($backgroundLight-secondary, 2%);
    }
    .searchIn {
      background-color: rgba($backgroundLight-secondary, 50%);
      box-shadow:rgba(156, 156, 156, 0.2) 0px 1px 0px 0px, rgba(132, 132, 133, 0.05) 0px 1.5px 0px 0px, rgba(156, 156, 156, 0.05) 0px 2px 0px 0px;
    }
    .PIDLink {
      background: rgba(#F2F3F5, 90%);
    }
  }
</style>
