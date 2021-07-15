<template>
  <div class="project" v-if="PIDIsSelected">
    <transition name="drop-top">
      <div class="container">
        <n-h1>{{project.name}}</n-h1>
        <n-thing style="transition: all 0.5s">
          <template #avatar>
            <n-avatar :src="`/img/languages/${project.category}.png`"></n-avatar>
          </template>
          <template #header>
            <n-button v-if="!project.private" @click="openShare(project._id)">
              <template #icon>
                <n-icon>
                  <ChannelShare12Filled />
                </n-icon>
              </template>
              {{project._id}}
            </n-button>
            <span v-else>{{project._id}}</span>
            <n-button text @click="updateVisibility">
              <template #icon>
                <n-icon style="margin-left:10px" :style="!project.private ? null : 'margin-top:5px;'">
                  <ShieldDismiss20Regular v-if="project.private" style="color: #e74c3c !important"/>
                  <ShieldCheckmark48Regular v-else style="color: #2ecc71 !important"/>
                </n-icon>
              </template>
            </n-button>
          </template>
          <template #header-extra>
            <n-space>
              <n-button text size="small" @click="editModal = true">
                <template #icon>
                  <Edit24Regular />
                </template>
              </n-button>
              <n-button text size="small" @click="confirmDelete = true">
                <template #icon>
                  <Delete28Regular />
                </template>
              </n-button>
            </n-space>
          </template>
          <template #description> Date: {{ new Date(project.created_at * 1000 ).toLocaleString() }} </template>
          <div style="padding:24px; box-sizing:border-box;">
            <Markdown :source="project.description" />
            <!-- project.description -->
          </div>
        </n-thing>
        <div class="codePreview">

          <div class="content">
            <section v-for="code in project.code" :key="code">
              <div v-if="code.code">
                <span class="fileCode">{{ code.file }}</span>
                <div class='code code-css'>
                  <label>
                    <n-button text size="small">
                      <!-- <template #icon>
                        <n-icon>
                          <Javascript16Filled />
                        </n-icon>
                      </template> -->
                      {{code.language}}
                    </n-button>
                  </label>
                  <prism-editor class="my-editor prism-editor__textarea" v-model="code.code" :highlight="highlighter" line-numbers :readonly="true"></prism-editor>
                </div>
                <span class="fileCode description-code">
                  <n-blockquote>
                    {{ code.description }}
                  </n-blockquote>
                </span>
              </div>
            </section>
          </div>

          <!-- <div class="sommaire">
            <ul>
              <li v-for="on in 3" :key="on">lol</li>
            </ul>
          </div> -->

        </div>
      </div>
    </transition>
    <n-modal v-model:show="confirmDelete" :mask-closable="true" >
      <n-card style="width:600px;" title="Supprission du projet" :bordered="false" :native-scrollbar="false" >
        <span>Voulez-vous supprimer le projet ?</span>
        <template #footer>
          <n-space>
            <n-button type="error" @click="confirmDelete = false">annuler</n-button>
            <n-button type="success" @click="deleteProject(project._id)">Accepter</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="editModal" :mask-closable="false" >
      <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
        <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
          <template #header-extra><n-button class="modalClose" text @click="editModal = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
          <edit-project @showUpdate="modalClose" :params="project"/>
        </n-card>
      </n-layout>
    </n-modal>
  </div>
  <div class="home" v-else>
    <transition name="drop-top">
      <n-result class="welcome" status="404" :title="$t('project.no_data')" :description="$t('project.selectOrCreate')" size="huge">
        <template #footer>
          <n-button @click="addProject = true">{{ $t('utils.create') }}</n-button>
        </template>
      </n-result>
    </transition>
    <n-modal v-model:show="addProject" :mask-closable="false" >
      <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
        <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
          <template #header-extra><n-button class="modalClose" text @click="addProject = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
          <AddProject @showUpdate="modalClose"/>
        </n-card>
      </n-layout>
    </n-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useNotification, NH1, NThing, NSpace, NIcon, NButton, NAvatar, NResult, NModal, NCard, NLayout, NBlockquote, useMessage } from 'naive-ui'
import { Edit24Regular, Delete28Regular, Dismiss20Regular, ShieldDismiss20Regular, ShieldCheckmark48Regular, ChannelShare12Filled } from '@vicons/fluent'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import AddProject from '@/components/AddProject.vue'
import editProject from '@/components/EditProject.vue'
import router from '@/router'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import { isElectron } from 'environ'
const isApp = ref(isElectron())

export default {
  name: 'home',
  layout: 'dashboard',
  components: {
    NH1,
    NThing,
    NSpace,
    NIcon,
    NButton,
    NAvatar,
    NResult,
    PrismEditor,
    NModal,
    NCard,
    AddProject,
    NLayout,
    NBlockquote,
    editProject,
    // Icons:
    Edit24Regular,
    Delete28Regular,
    Dismiss20Regular,
    ShieldDismiss20Regular,
    ShieldCheckmark48Regular,
    ChannelShare12Filled
  },
  setup () {
    const store = useStore()
    const notification = useNotification()
    const addProject = ref(false)
    const editModal = ref(false)
    const PIDIsSelected = ref(false)
    const { t } = useI18n({ useScope: 'global' })
    const project = computed(() => {
      return store.state.project.project
    })
    const message = useMessage()
    const confirmDelete = ref(false)
    const loggedIn = computed(() => {
      return store.state.auth.status.loggedIn
    })
    onMounted(() => {
      PIDIsSelected.value = store.state.project.PIDIsSelected
    })
    watchEffect(() => {
      PIDIsSelected.value = store.state.project.PIDIsSelected
    })

    function highlighter (code) {
      return highlight(code, languages.js)
    }

    function openShare (id) {
      if (isApp.value) {
        const { shell } = require('electron')
        shell.openExternal(`https://codebase.nihilo.fr/share/${id}`)
      } else {
        window.open(`https://codebase.nihilo.fr/share/${id}`, '_blank')
      }
    }

    function updateVisibility () {
      const togglePrivate = { private: project.value.private = !project.value.private }
      const result = {
        data: togglePrivate,
        pid: project.value._id
      }
      store.dispatch('project/UPDATE_PROJECT', result)
      message.success(`${t('project.update_success')}`)
    }

    function modalClose () {
      addProject.value = false
      editModal.value = false
    }

    function deleteProject (PID) {
      store.dispatch('project/DELETE_PROJECT', PID)
      confirmDelete.value = false
    }

    function logout () {
      notification.warning({
        content: 'Deconnexion réussie',
        meta: 'blabla',
        duration: 5000
      })
      store.dispatch('auth/logout')
      router.push('/login')
    }
    return {
      openShare,
      updateVisibility,
      PIDIsSelected,
      editModal,
      modalClose,
      addProject,
      highlighter,
      deleteProject,
      project,
      logout,
      loggedIn,
      confirmDelete
    }
  }
}
</script>
<style>
.prism-editor__textarea:focus {
  outline: none;
}
</style>
<style lang="scss" scoped>
@import '@/assets/style/animations.scss';

.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}

.home {
  position:relative;
  height: calc(100vh - 150px);
  display: flex;
  vertical-align: middle;
  .welcome {
    margin:auto
  }
}
.codePreview {
  position:relative;
  margin: 34px 0;
  width:100%;
  display: flex;
  .sommaire {
    position:sticky;
    top:0;
    right: 0;
    max-width: 200px;
    height: auto;
  }
  .content {
    display: block;
    max-width: 100%;
    width:100%;
  }
}
// @media screen AND (max-width: 1100px) {
//   .sommaire {
//     display: none;
//   }
//   .content {
//     max-width: 100% !important;
//   }
// }
pre {
  &:after {
    content: "double click to selection";
    padding: 0;
    width: auto;
    height: auto;
    position: absolute;
    right: 18px;
    top: 14px;
    font-size: 12px;
    opacity: 0.5;
    line-height: 20px;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    transition: all 0.3s ease;
  }
  &:hover::after {
    opacity: 0;
    visibility: visible;
  }
}
.fileCode {
  display: block;
  opacity: .4;
  padding: 0 30px;
  box-sizing: border-box;
  transition: all 0.8s;
  &.description-code {
    position:relative;
    margin-bottom:30px;
  }
  &:hover {
    opacity: 1;
  }
}
.dark {
  div.code {
    background: #333;
  }
}
.light {
  div.code {
    background: #fff;
  }
}
div.code {
  margin: 5px 25px 15px 22px;
  border-radius: 8px;
  // box-shadow: 0 0 5px 8px rgba(gray, 1%);
  position: relative;
  display: flex;
  overflow: auto;
  padding:0;
  color:inherit;
  .inner-code {
    position:relative;
    font-family: "Inconsolata","Monaco","Consolas","Andale Mono","Bitstream Vera Sans Mono","Courier New",Courier,monospace;
    display: block;
    padding: 24px 16px;
    border-left: 1px solid #555;
    overflow-x: auto;
    font-size: 13px;
    line-height: 19px;
    width:100%;
    pre {
      // white-space: pre;
      word-wrap: break-word;
      white-space: pre;
    }
  }
  label {
    font-family: sans-serif;
    font-weight: bold;
    font-size: 13px;
    position: relative;
    padding:5px 15px;
    box-sizing: border-box;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    pointer-events: none;
  }
}
</style>
