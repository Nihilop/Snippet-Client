<route>
{
  "name": "adminPanel",
  "meta": {
    "requiresAuth": true
  }
}
</route>
<template>
  <n-tabs type="bar" tab="user">
    <n-tab-pane name="home" tab="Accueil / Statistique">
      <h1>Admin page</h1>
    </n-tab-pane>
    <n-tab-pane name="projects" tab="Tous les projets">
      <n-thing title=" ">
        <template #header-extra>
          <n-button @click="refreshProjectList">
            <n-icon>
              <ArrowClockwise20Filled />
            </n-icon>
          </n-button>
        </template>
      </n-thing>
      <n-list bordered class="projectsList">
        <n-list-item v-for="(project, index) in projectsList" :key="index" class="liste_item">
          <template #prefix>
            <n-icon :size="16">
              <ShieldCheckmark16Filled v-if="project.private" style="color: #2ecc71" />
              <ShieldCheckmark16Filled v-else style="color: gray" />
            </n-icon>
          </template>
          <n-thing class="project_liste">
            <template #avatar>
              <n-avatar :src="`/img/languages/${project.category}.png`"></n-avatar>
            </template>
            <template #header>
              {{project.name}}
            </template>
            <template #header-extra>
              <!-- <n-dropdown @select="handleUserStatus" trigger="click" :options="userStatusOptions" placement="bottom-end">
                <n-button text @click="handleProjectClick(user)">
                  <template #icon>
                    <n-icon>
                      <CheckboxPerson24Filled v-if="project.verified" style="color: #2ecc71"/>
                      <Warning20Regular style="color: #f39c12"/>
                    </n-icon>
                  </template>
                </n-button>
              </n-dropdown> -->
            </template>
            <template #description>
              <span class="desc-project">{{project.description}}</span>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
    <n-tab-pane name="user" tab="Gestionnaire d'utilisateur">
      <n-thing title=" ">
        <template #header-extra>
          <span style="font-size:3em">{{currentTime}}</span>s
        </template>
      </n-thing>
      <n-list bordered class="usersList">
        <n-list-item v-for="(user, index) in usersList" :key="index">
          <template #prefix>
            <n-icon :size="16">
              <ShieldCheckmark16Filled v-if="user.admin" style="color: #2ecc71" />
              <Person28Regular v-else />
            </n-icon>
          </template>
          <n-thing>
            <template #avatar>
              <n-avatar :src="user.avatar"></n-avatar>
            </template>
            <template #header>
              {{user.name}} - {{user.admin ? ' ADMINISTRATEUR' : 'UTILISATEUR'}}
            </template>
            <template #header-extra>
              <n-dropdown @select="handleUserStatus" trigger="click" :options="userStatusOptions" :render-label="renderUserLabel" placement="bottom-end">
                <n-button text @click="handleClick(user)">
                  <template #icon>
                    <n-icon>
                      <CheckboxPerson24Filled v-if="user.verified" style="color: #2ecc71"/>
                      <Warning20Regular v-else style="color: #f39c12"/>
                    </n-icon>
                  </template>
                </n-button>
              </n-dropdown>
            </template>
            <template #description> {{user.email}} </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
    <n-tab-pane name="blog" tab="Blog">
      <admin-post />
    </n-tab-pane>
  </n-tabs>
  <n-modal v-model:show="confirmDelete" :mask-closable="true" >
    <n-card style="width:600px;" :title="$t('utils.delete')" :bordered="false" :native-scrollbar="false" >
      <span>{{ $t('utils.confirm_delete_user')}}</span>
      <template #footer>
        <n-space>
          <n-button type="error" @click="confirmDelete = false">{{ $t('utils.cancel')}}</n-button>
          <n-button type="success" @click="deleteAccount">{{ $t('utils.delete')}}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
<script>
import { computed, onMounted, onUnmounted, ref, watchEffect, h } from 'vue'
import { useStore } from 'vuex'
import { NTabs, NTabPane, NList, NListItem, NThing, NIcon, NAvatar, NButton, NDropdown, useMessage, NCard, NModal, NSpace } from 'naive-ui'
import { ShieldCheckmark16Filled, Person28Regular, CheckboxPerson24Filled, Warning20Regular, ArrowClockwise20Filled, Delete28Regular } from '@vicons/fluent'
import AdminPost from '@/components/blog/AdminPosts.vue'
import router from '@/router'
export default {
  name: 'adminIndex',
  layout: 'dashboard',
  components: {
    AdminPost,
    NTabs,
    NTabPane,
    NList,
    NListItem,
    NThing,
    NIcon,
    NButton,
    NAvatar,
    NDropdown,
    ShieldCheckmark16Filled,
    Person28Regular,
    CheckboxPerson24Filled,
    ArrowClockwise20Filled,
    Warning20Regular,
    NCard,
    NModal,
    NSpace
  },
  setup () {
    const store = useStore()
    const usersList = ref(null)
    const projectsList = ref(null)
    const userSelected = ref({})
    const message = useMessage()
    const confirmDelete = ref(false)
    const timer = ref('')
    const currentTime = ref(null)
    const isAdmin = computed(() => {
      return store.state.user.currentUser.admin
    })
    onMounted(async () => {
      if (isAdmin.value) {
        const users = await store.dispatch('admin/getAllUsers')
        usersList.value = users.users
        const projects = await store.dispatch('admin/getAllProjects')
        projectsList.value = projects.data
      } else {
        router.push('/')
      }
      countDown(60)
    })

    // watchEffect(() => {
    //   usersList.value = store.state.admin.users
    //   projectsList.value = store.state.admin.projectsz
    // })

    function countDown (time) {
      timer.value = setInterval(() => {
        time--
        currentTime.value = time
        if (time <= 0) {
          fetchUsers()
          cancelAutoUpdate()
          countDown(60)
        }
      }, 1000)
    }

    async function fetchUsers () {
      const users = await store.dispatch('admin/getAllUsers')
      usersList.value = users.users
      // const projects = await store.dispatch('admin/getAllProjects')
      // projectsList.value = projects.data
      message.success("Liste d'utilisateur mis à jour.")
    }

    onUnmounted(() => {
      cancelAutoUpdate()
    })

    function cancelAutoUpdate () {
      clearInterval(timer.value)
    }

    function handleClick (user) {
      userSelected.value = user
    }

    async function refreshProjectList () {
      const projects = await store.dispatch('admin/getAllProjects')
      projectsList.value = projects.data
    }

    async function handleUserStatus (key) {
      let keyToUpdate = {}
      if (key === 'verify') {
        if (userSelected.value.verified) {
          keyToUpdate = { verified: false }
        } else {
          keyToUpdate = { verified: true }
        }
      }
      if (key === 'admin') {
        if (userSelected.value.email === 'nihilo@outlook.fr') {
          message.error('Impossible de changer le status de cet admin, deso bru')
          return
        }
        if (userSelected.value.admin) {
          keyToUpdate = { admin: false }
        } else {
          keyToUpdate = { admin: true }
        }
      }
      if (key === 'delete') {
        confirmDelete.value = true
        return
      }
      const data = {
        user: keyToUpdate,
        UID: userSelected.value._id
      }
      console.log(data)
      const userUpdated = await store.dispatch('user/update', data)
      console.log(userUpdated)
      if (userUpdated.status) {
        message.success('Le profile a bien été mis à jour.')
        reloadDatas()
      } else {
        message.error('Le profile ne peut pas être mis à jour !!!')
      }
    }

    async function reloadDatas () {
      const users = await store.dispatch('user/getAllUsers')
      usersList.value = users.users
    }

    function deleteAccount () {
      if (!userSelected.value.admin) {
        store.dispatch('user/delete', userSelected.value._id).then(() => {
          message.success('Le profile a bien été supprimer.')
          reloadDatas()
          confirmDelete.value = false
        }).catch((e) => {
          if (e.response) {
            console.log(e.response)
            message.error(e.response)
          }
          confirmDelete.value = false
        })
      } else {
        message.error('Ce compte est administrateur ! Tu ne peux pas faire ça')
      }
    }

    return {
      refreshProjectList,
      projectsList,
      currentTime,
      deleteAccount,
      confirmDelete,
      usersList,
      renderUserLabel: (option) => {
        if (option.key === 'divider') {
          return
        }
        if (option.key === 'verify') {
          return [
            h(NIcon, { style: { verticalAlign: 'middle', marginRight: '8px', color: userSelected.value.verified ? '#f39c12' : '#2ecc71' } }, { default: () => h(userSelected.value.verified ? Warning20Regular : CheckboxPerson24Filled) }),
            h('span', { style: { verticalAlign: 'middle', marginRight: '8px' } }, userSelected.value.verified ? 'Invalidé' : 'Valider')
          ]
        }
        if (option.key === 'admin') {
          return [
            h(NIcon, { style: { verticalAlign: 'middle', marginRight: '8px', color: userSelected.value.admin ? '#e74c3c' : '#3498db' } }, { default: () => h(ShieldCheckmark16Filled) }),
            h('span', { style: { verticalAlign: 'middle', marginRight: '8px' } }, userSelected.value.admin ? 'Retirer admin' : 'Mettre admin')
          ]
        }
        if (option.key === 'delete') {
          return [
            h(NIcon, { style: { verticalAlign: 'middle', marginRight: '8px', color: '#e74c3c' } }, { default: () => h(Delete28Regular) }),
            h('span', { style: { verticalAlign: 'middle', marginRight: '8px', fontWeight: 'bold', color: '#e74c3c' } }, 'Supprimer')
          ]
        }
      },
      userStatusOptions: [
        {
          label: '',
          key: 'verify'
        },
        {
          type: 'divider',
          key: 'divider'
        },
        {
          label: '',
          key: 'admin'
        },
        {
          label: '',
          key: 'delete'
        }
      ],
      handleUserStatus,
      handleClick
    }
  }
}
</script>
<style lang="scss" scoped>
.usersList, .projectsList {
  margin-top:20px;
}

.liste_item {
  width:100%;
  .project_liste {
    position:relative;
    display: block;
    max-width: 100%;
    overflow:hidden;
  }
}
</style>
