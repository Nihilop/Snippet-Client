<template>
  <header class="header_bar">
    <div class="user_container">
      <n-dropdown @select="userOptionSelect" trigger="click" :options="userOptions" placement="bottom-end">
        <n-button text>
          <template #icon>
            <n-avatar style="height:auto;" :src="currentUser.avatar"></n-avatar>
          </template>
          {{ currentUser.name }} <!-- <span class="status" :style="online ? 'background:green' : 'background:red'"></span> -->
        </n-button>
      </n-dropdown>
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
          v-if="$store.state.project.CIDIsSelected && $route.name === 'index'"
          class="sidebarL_options glass"
          :class="windowsWidth <= 380 && $store.state.project.CIDIsSelected ? 'menu--open_mobile' : null"
          :width="windowsWidth <= 380 ? '100%' : 280">
          <!-- sidebar + -->
          <projects-list />
          <n-button class="addDoc" v-if="$store.state.project.CIDIsSelected" @click="modalAdd = !modalAdd" type="primary">
            <n-icon>
              <Add24Regular />
            </n-icon>
          </n-button>
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
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title="Paramètres de l'application" :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="settingsModal = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <settings-content />
        <!-- <template #footer> Footer </template> -->
      </n-card>
    </n-layout>
  </n-modal>

  <n-modal v-model:show="modalAdd" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="modalAdd = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <AddProject @showUpdate="modalClose"/>
      </n-card>
    </n-layout>
  </n-modal>

</template>
<script>
import { defineComponent, ref, onMounted, watchEffect } from 'vue'
import { NLayout, NLayoutSider, NButton, NIcon, NModal, NCard, NAvatar, NDropdown, useNotification } from 'naive-ui'
import { Dismiss20Regular, Add24Regular, Settings28Filled } from '@vicons/fluent'
import { useStore } from 'vuex'
import router from '@/router'
// import { useI18n } from 'vue-i18n'
// Component
import SettingsContent from '@/components/SettingsContent.vue'
import ProjectsList from '@/components/ProjectsList.vue'
import CategorySidebar from '@/components/CategorySidebar.vue'
import AddProject from '@/components/AddProject.vue'
export default defineComponent({
  components: {
    // Components:
    SettingsContent,
    ProjectsList,
    CategorySidebar,
    AddProject,
    // NaiveUI:
    NLayout,
    NLayoutSider,
    NButton,
    NIcon,
    NModal,
    NCard,
    NAvatar,
    NDropdown,
    // Icons:
    Dismiss20Regular,
    Add24Regular,
    Settings28Filled
  },
  setup () {
    // Options for electron titlebar
    const store = useStore()
    const settingsModal = ref(false)
    const modalAdd = ref(false)
    const currentUser = ref(null)
    const windowsWidth = ref(window.innerWidth)
    const notification = useNotification()
    onMounted(() => {
      window.onresize = () => { windowsWidth.value = window.innerWidth }
      store.dispatch('user/currentUser').catch(e => {
        console.log(e)
      })
      setTimeout(() => {
        if (currentUser.value.name === null || currentUser.value.name === undefined) {
          notification.error({
            content: 'API Error',
            meta: "Nous ne parvenons pas à trouver vos informations.. vous allez être redirigé à la page d'authentification dans 2 secondes",
            duration: 5000
          })
          setTimeout(() => {
            logout()
          }, 2000)
        }
      }, 500)
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

    function modalClose () {
      console.log('recu !')
      modalAdd.value = false
    }

    watchEffect(() => {
      // console.log(`Categorie: ${store.state.CIDIsSelected} & project: ${store.state.PIDIsSelected}`)
      currentUser.value = store.state.user.currentUser
    })

    return {
      modalClose,
      windowsWidth,
      settingsModal,
      currentUser,
      modalAdd,
      online: true,
      userOptions: [
        {
          label: 'Github',
          key: 1
        },
        {
          label: 'Paramètres',
          key: 2
        },
        {
          type: 'divider',
          key: 'divier'
        },
        {
          label: 'Déconnection',
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
  .addDoc {
    position:fixed;
    bottom: 20px;
    right: 10%;
    width:40px;
    height:40px;
    border-radius:50%;
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
