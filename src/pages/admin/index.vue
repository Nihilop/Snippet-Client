<template>
  <n-tabs type="line" tab="user">
    <n-tab-pane name="home" tab="Accueil / Statistique">
      <h1>Admin page</h1>
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
              <n-dropdown @select="handleUserStatus" trigger="click" :options="userStatusOptions" placement="bottom-end">
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
      creation de blog (creer un component pour ça)
    </n-tab-pane>
  </n-tabs>
  <n-modal v-model:show="confirmDelete" :mask-closable="true" >
    <n-card style="width:600px;" title="Supprimer le compte" :bordered="false" :native-scrollbar="false" >
      <span>Confirmez vous la suppression du compte utilisateur ? toutes ses données seront supprimées</span>
      <template #footer>
        <n-space>
          <n-button type="error" @click="confirmDelete = false">annuler</n-button>
          <n-button type="success" @click="deleteAccount">Accepter</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>
<script>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { NTabs, NTabPane, NList, NListItem, NThing, NIcon, NAvatar, NButton, NDropdown, useMessage, NCard, NModal, NSpace } from 'naive-ui'
import { ShieldCheckmark16Filled, Person28Regular, CheckboxPerson24Filled, Warning20Regular } from '@vicons/fluent'
import router from '@/router'
var intervalTimer
export default {
  name: 'adminIndex',
  layout: 'dashboard',
  components: {
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
    Warning20Regular,
    NCard,
    NModal,
    NSpace
  },
  setup () {
    const store = useStore()
    const usersList = ref(null)
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
        const users = await store.dispatch('user/getAllUsers')
        usersList.value = users.users
      } else {
        router.push('/')
      }
      countDown(60)
    })

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

    function fetchUsers () {
      store.dispatch('user/getAllUsers').then(data => {
        usersList.value = data.users
        message.success("Liste d'utilisateur mis à jour.")
      })
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
      currentTime,
      deleteAccount,
      confirmDelete,
      usersList,
      userStatusOptions: [
        {
          label: 'Vérifier la personne',
          key: 'verify'
        },
        {
          type: 'divider',
          key: 'divier'
        },
        {
          label: 'Mettre admin',
          key: 'admin'
        },
        {
          label: 'Supprimer',
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
.usersList {
  margin-top:20px;
}
</style>
