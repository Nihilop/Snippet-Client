<template>
<div class="login_wrapper">
  <div class="w-full max-w-sm m-auto rounded py-12 px-5 shadow-md l_wrap">
    <header>
      <img class="w-20 mx-auto mb-5" src="/img/logo.png" />
    </header>
    <n-form :model="model" ref="formRef" :rules="rules">
      <n-form-item path="email" label="Email">
        <n-input v-model:value="model.email" @keydown.enter.prevent type="email" placeholder="adresse@email.fr"/>
      </n-form-item>
      <n-form-item path="password" label="Mot de passe">
        <n-input
          v-model:value="model.password"
          type="password"
          @keydown.enter.prevent
          placeholder="Mot de passe"
        />
      </n-form-item>
      <n-space vertical>
        <n-checkbox v-model:checked="model.keepCo">Rester connecter ?</n-checkbox>
        <n-button class="w-full mb-5" type="primary" :disabled="btnDisabled" @click="handleValidateButtonClick">Connexion</n-button>
      </n-space>
    </n-form>
    <footer>
      <n-a class="text-sm float-left" href="#">Mot de passe oublié?</n-a>
      <router-link class="text-sm float-right" to="/register">Se créer un compte</router-link>
    </footer>
  </div>
</div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { NButton, NA, NForm, NFormItem, NInput, useNotification, NCheckbox, NSpace } from 'naive-ui'
import { useStore } from 'vuex'
import router from '@/router'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'loginPage',
  components: {
    NButton,
    NA,
    NForm,
    NFormItem,
    NInput,
    NCheckbox,
    NSpace
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const formRef = ref(null)
    const loading = ref(false)
    const rPasswordFormItemRef = ref(null)
    const notification = useNotification()
    const btnDisabled = ref(false)
    const loggedIn = computed(() => {
      return store.state.auth.status.loggedIn
    })
    const modelRef = ref({
      email: null,
      password: null,
      keepCo: false
    })

    onMounted(() => {
      if (loggedIn.value && !route.query.redirect) {
        router.push('/')
      }
    })

    function connectAPI () {
      loading.value = true
      btnDisabled.value = true
      store.dispatch('auth/login', modelRef.value).then(
        () => {
          store.dispatch('user/currentUser').then((data) => {
            console.log(data)
            if (data.user.verified) {
              notification.success({
                content: 'Connexion réussie',
                meta: 'Vous avez été rediriger !',
                duration: 5000
              })
              console.log(route.query.redirect)
              if (route.query.redirect) {
                router.push(route.query.redirect)
              } else {
                router.push('/')
              }
              store.dispatch('project/RESET_ALL')
            } else {
              btnDisabled.value = false
              notification.error({
                content: 'Vérification du compte',
                meta: 'Un administrateur vérifie le statut de votre compte.',
                duration: 5000
              })
              store.dispatch('auth/logout')
            }
          })
        }
      ).catch(e => {
        btnDisabled.value = false
        if (e.response) {
          console.log(e.response.data.message)
          notification.error({
            title: e.response.data.message || 'Serveur offline',
            duration: 5000
          })
        }
      })
    }
    return {
      btnDisabled,
      formRef,
      connectAPI,
      loggedIn,
      rPasswordFormItemRef,
      model: modelRef,
      rules: {
        email: [{
          required: true,
          validator (rule, value) {
            if (!value) {
              return new Error("L'Email est requis")
            }
            return true
          },
          trigger: ['input', 'blur']
        },
        {
          required: true,
          validator (rule, value) {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) { //eslint-disable-line
              return new Error("L'Adresse email n'est pas valide")
            }
            return true
          },
          trigger: ['blur']
        }],
        keepCo: [
          {
            required: false
          }
        ],
        password: [
          {
            required: true,
            message: 'Password is required'
          }
        ]
      },
      handleValidateButtonClick (e) {
        e.preventDefault()
        formRef.value.validate((errors) => {
          if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(modelRef.value.email)) { //eslint-disable-line
            return console.log('error ', errors)
          }
          if (!errors) {
            connectAPI()
          } else {
            console.log(errors)
            console.log('Invalid')
          }
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
  .login_wrapper {
    width:100vw;
    height:calc(100vh - 28px);
    display:flex;
    vertical-align:middle;
    justify-content: center;
  }
</style>
