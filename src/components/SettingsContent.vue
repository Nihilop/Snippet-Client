<template>
  <div class="settings">
    <n-form :model="appSettings" style="max-width:90%; margin:auto;">
      <n-list bordered>
        <n-list-item>
        <n-h1>Paramètres:  {{modelRef.settings.color}}</n-h1>
          <n-list>
            <!-- Item in Categorie -->
            <n-list-item class="list_box">
              <template #suffix>
                <n-button text @click="changeTheme">
                  <n-icon :size="24">
                    <WeatherSunny24Filled v-if="appSettings.themeColor === 'dark'"/>
                    <WeatherMoon24Filled v-else />
                  </n-icon>
                </n-button>
              </template>
              <n-thing class="noSelect" title="Options de thème" description="Cette feature rencontre quelques problèmes mais elle passe du theme sombre à clair" />
            </n-list-item>
            <!-- Color primary -->
            <n-list-item class="list_box">
              <template #suffix>
                <n-form-item path="color" :rule="colorRule">
                  <n-color-picker class="pickerOption" v-model:value="modelRef.settings.color" :default-value="modelRef.settings.color" :show-alpha="true" :modes="['hex']"/>
                </n-form-item>
              </template>
              <n-thing class="noSelect" title="Couleur primaire" description="Changer la couleur principal lié aux modules : boutton, champs de textes, etc.." />
            </n-list-item>
            <!-- app settings -->
            <n-list-item class="list_box" v-if="isElectron">
              <template #suffix>
                <n-switch v-model:value="active" />
              </template>
              <n-thing class="noSelect" title="Démarrage automatique" description="Lancer l'application au démarrage de windows" />
            </n-list-item>
          </n-list>
        </n-list-item>
        <n-list-item>
          <n-h1>Utilisateur: </n-h1>
          <n-list>
            <n-list-item class="list_box">
              <template #suffix>
                <n-form-item path="email">
                  <n-input v-model:value="modelRef.email" placeholder="adress@email.com" disabled/>
                </n-form-item>
              </template>
              <n-thing class="noSelect" title="Adresse email" description="Changer votre adresse email de connexion." />
            </n-list-item>
            <n-list-item class="list_box">
              <template #suffix>
                <n-form-item path="username" :rule="usernameRule">
                  <n-input v-model:value="modelRef.name" placeholder="Nom d'utilisateur"/>
                </n-form-item>
              </template>
              <n-thing class="noSelect" title="Nom d'utilisateur" description="Changer votre pseudo." />
            </n-list-item>
            <n-list-item class="list_box">
              <template #suffix>
                <n-space vertical>
                  <n-input v-model:value="passwordChange" placeholder="Mot de passe" type="text"/>
                  <n-form-item path="password" label="Confirmer" :rule="confirmPasswordRule" v-if="passwordChange && passwordChange.length >= 8">
                    <n-input v-model:value="modelRef.password" placeholder="Confirmer mot de passe" type="text"/>
                  </n-form-item>

                </n-space>
              </template>
              <n-thing class="noSelect" title="Mot de passe" description="Changer votre mot de passe. Il doit faire au moins 8 caractères" />
            </n-list-item>
            <n-list-item class="list_box">
              <template #suffix>
                <div class="upload-avatar_wrapper" v-if="!preview" >
                  <input name="avatar" type="file" accept="image/*" @change="previewImage" class="upload-avatar" id="my-file"/>
                </div>
                <div v-if="preview" class="avatar-preview" @click="reset">
                  <img :src="preview || modelRef.avatar" />
                  <!-- <p class="mb-0">file name: {{ image.name }}</p>
                  <p class="mb-0">size: {{ image.size/1024 }}KB</p> -->
                </div>
              </template>
              <n-thing class="noSelect" title="Avatar" description="Changer votre avatar." />
            </n-list-item>
            <n-list-item class="list_box">
              <template #suffix>
                <n-form-item path="color" :rule="colorRule">
                  <n-button @click="confirmDelete = true" type="error">Supprimer</n-button>
                </n-form-item>
              </template>
              <n-thing class="noSelect" title="Supression" description="Supprimer le compte utilisateur." />
            </n-list-item>
          </n-list>
        </n-list-item>
      </n-list>
    </n-form>
    <!-- Save or reset btn toggled -->
    <transition name="drop-bottom">
      <div id="save_modifications" v-if="mustBeSave">
        <n-card :border="false">
          <div class="save_card">
            <n-thing class="text_wrapper noSelect" :title="$t('utils.save')" :description="$t('utils.save_message')" />
            <n-space class="btn_wrapper">
              <n-button class="resetBtn" text @click="resetChange">{{$t('utils.reset')}}</n-button>
              <n-button type="success" @click="saveParameters">{{$t('utils.save')}}</n-button>
            </n-space>
          </div>
        </n-card>
      </div>
    </transition>
    <n-modal v-model:show="confirmDelete" :mask-closable="true" >
      <n-card style="width:600px;" title="Supprimer le compte" :bordered="false" :native-scrollbar="false" >
        <span>Confirmez vous la suppression du compte utilisateur ? toutes vos données seront supprimées</span>
        <template #footer>
          <n-space>
            <n-button type="error" @click="confirmDelete = false">annuler</n-button>
            <n-button type="success" @click="deleteAccount">Accepter</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, reactive, watchEffect, computed } from 'vue'
import { NList, NListItem, NThing, NSwitch, NButton, NSpace, NIcon, NH1, NColorPicker, NForm, NFormItem, useNotification, NInput, NCard, NModal, useMessage } from 'naive-ui'
import { WeatherSunny24Filled, WeatherMoon24Filled } from '@vicons/fluent'
import { isElectron } from 'environ'
import { useStore } from 'vuex'
import router from '@/router'
export default defineComponent({
  name: 'settings',
  layout: 'dashboard',
  components: {
    NList,
    NListItem,
    NThing,
    NSwitch,
    NButton,
    NSpace,
    NIcon,
    NH1,
    NColorPicker,
    NForm,
    NFormItem,
    NInput,
    NCard,
    NModal,
    // Icons:
    WeatherSunny24Filled,
    WeatherMoon24Filled
  },
  data () {
    return {
      isElectron: isElectron()
    }
  },
  setup () {
    const active = ref(false)
    const store = useStore()
    const mustBeSave = ref(false)
    const notification = useNotification()
    const image = ref(null)
    const preview = ref(null)
    const currentUser = ref(null)
    const mustSendAPI = ref(false)
    const confirmDelete = ref(false)
    const userId = ref(null)
    const message = useMessage()
    const passwordChange = ref('')
    const modelRef = ref({
      name: null,
      email: null,
      password: null,
      avatar: null,
      settings: {
        color: null
      }
    })
    const dataModified = computed(() => {
      return Object.keys(modelRef.value).reduce((formData, field) => {
        if (modelRef.value[field] !== currentUser.value[field]) {
          formData[field] = modelRef.value[field]
        }
        return formData
      }, {})
    })
    const appSettings = reactive({
      themeColor: null
    })

    onMounted(() => {
      appSettings.themeColor = localStorage.theme || 'dark'

      store.dispatch('user/currentUser').catch(e => {
        console.log(e)
        notification.error({
          content: 'API Error',
          meta: 'Nous ne parvenons pas à trouver vos informations..',
          duration: 5000
        })
      })
    })

    watchEffect(() => {
      currentUser.value = store.state.user.currentUser
      userId.value = store.state.user.currentUser._id
      modelRef.value.name = currentUser.value.name
      modelRef.value.settings.color = currentUser.value.settings.color
      modelRef.value.email = currentUser.value.email
      preview.value = currentUser.value.avatar
      modelRef.value.avatar = currentUser.value.avatar
      modelRef.value.password = currentUser.value.password
    })

    function deleteAccount () {
      if (userId.value) {
        store.dispatch('user/delete', userId.value).then(() => {
          store.dispatch('auth/logout')
          router.push('/login')
        }).catch((e) => {
          if (e.response) {
            console.log(e.response)
          }
        })
      }
    }

    function changeTheme () {
      if (appSettings.themeColor === 'light') {
        appSettings.themeColor = 'dark'
      } else {
        appSettings.themeColor = 'light'
      }
      store.dispatch('CHANGE_THEME', appSettings.themeColor)
    }

    function previewImage (event) {
      var input = event.target
      if (input.files) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.preview = e.target.result
          modelRef.value.avatar = this.preview
          mustBeSave.value = true
          mustSendAPI.value = true
        }
        this.image = input.files[0]
        reader.readAsDataURL(input.files[0])
        reader.onerror = function (error) {
          console.log('Error: ', error)
        }
      }
    }
    function reset () {
      this.image = null
      this.preview = null
      mustSendAPI.value = false
    }

    function resetChange () {
      modelRef.value.name = currentUser.value.name
      modelRef.value.email = currentUser.value.email
      modelRef.value.settings.color = currentUser.value.settings.color
      preview.value = currentUser.value.avatar
      modelRef.value.avatar = currentUser.value.avatar
      modelRef.value.password = ''
      mustBeSave.value = false
      mustSendAPI.value = false
    }

    function saveParameters () {
      const data = {
        user: dataModified.value,
        UID: currentUser.value._id
      }
      store.dispatch('user/update', data).then(() => {
        message.success('Le profile a bien été mis à jour.')
      }).catch((e) => {
        if (e.response) {
          console.log(e.response)
          notification.error({
            content: 'Erreur',
            meta: e.response.data.message,
            duration: 5000
          })
        }
      })
      mustBeSave.value = false
    }

    function validatePasswordSame (rule, value) {
      if (modelRef.value.password === passwordChange.value) {
        mustSendAPI.value = true
        mustBeSave.value = true
      } else {
        mustSendAPI.value = false
        mustBeSave.value = false
      }
      return modelRef.value.password === passwordChange.value
    }

    return {
      passwordChange,
      deleteAccount,
      resetChange,
      confirmDelete,
      image,
      preview,
      currentUser,
      modelRef,
      previewImage,
      reset,
      saveParameters,
      changeTheme,
      appSettings,
      colorRule: {
        trigger: 'change',
        validator (_, value) {
          if (value !== modelRef.value.settings.color) {
            mustSendAPI.value = true
            mustBeSave.value = true
          }
        }
      },
      usernameRule: {
        trigger: ['change', 'input'],
        validator (_, value) {
          if (value !== currentUser.value.name) {
            mustSendAPI.value = true
            mustBeSave.value = true
          }
        }
      },
      confirmPasswordRule: {
        validator: validatePasswordSame,
        message: 'Non identique',
        trigger: ['blur', 'password-input', 'change']
      },
      // passwordRule: {
      //   trigger: ['change', 'input'],
      //   validator (_, value) {
      //     if (value !== currentUser.value.password) {
      //       mustSendAPI.value = true
      //       mustBeSave.value = true
      //     }
      //   }
      // },
      active,
      mustBeSave
    }
  }
})
</script>
<style lang="scss">
.n-list .n-list-item .n-list-item__suffix {
  flex: inherit !important;
}
</style>
<style lang="scss" scoped>

.settings {
  max-width:1200px;
  margin:auto;
  max-height:100%;
  .inputOption {
    width: 50px;
  }
  .pickerOption {
    min-width:100px;
  }
  .list_box {
    border-radius: 6px;
    background:rgba(black, 10%);
    border:none !important;
    margin: 5px 0;
  }
}
.save_card {
  display: flex;
  vertical-align: middle;
  .text_wrapper {
    margin:auto 0;
    width: auto;
    height:100%;
  }
  .btn_wrapper {
    margin:auto 2% auto auto !important;
    width:fit-content;
    height: fit-content;
  }
}

.upload-avatar_wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: auto;
  position: relative;
  cursor: pointer;
  background-color: rgba(gray, 50%);
  width:80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  transition: 0.2s linear all;
  color: #ffffff;
  border: 2px dashed transparent;
  > div {
    width:100%;
    height: 100%;
  }
  &:hover {
    transition: ease 0.5s;
    border-color: gray;
    &:after{
      position:absolute;
      width:100%;
      height: 100%;
      top:0;
      left: 0;
      content: '+';
      line-height: 80px;
      text-align: center;
    }
  }
  .upload-avatar {
    width: 100%;
    height:100%;
    position: absolute;
    opacity: 0;
    margin:auto;
    cursor: pointer;
    z-index: 1;
  }
}

.avatar-preview {
  position:relative;
  &:hover {
    transition: ease 0.5s;
    &:after{
      position:absolute;
      width:100%;
      height: 100%;
      top:0;
      left: 0;
      content: '🗑️';
      line-height: 80px;
      text-align: center;
      background-color: rgba(gray, 60%);
      border-radius: 50%;
      cursor: pointer;
    }
  }
  > img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid gray;
  }
}

#save_modifications {
  background: #17171C;
  box-shadow: 0 0 5px 8px rgba(#17171C, 10%);
}

#save_modifications {
  position:sticky;
  width:100%;
  max-width: 90%;
  height: auto;
  min-height: 80px;
  border-radius: 5px;
  bottom: 20px;
  margin: 55px auto;
  .btn_wrapper {
    .resetBtn {
      padding: 9px 0px;
      margin: auto 24px;
      &:hover {
        color:#e74c3c;
      }
    }
  }
}

.drop-bottom-enter-active,
.drop-bottom-leave-active,
.drop-bottom-left-enter-active,
.drop-bottom-left-leave-active,
.drop-bottom-right-enter-active,
.drop-bottom-right-leave-active {
  transition: all 0.15s;
  transform: translateY(0px);
}

.drop-bottom-enter-from,
.drop-bottom-leave-to,
.drop-bottom-left-enter-from,
.drop-bottom-left-leave-to,
.drop-bottom-right-enter-from,
.drop-bottom-right-leave-to {
  transition: all 0.15s;
  transform: translateY(6px);
  opacity: 0;
}
</style>
