<template>
<div class="register_wrapper">
  <div class="w-full max-w-md m-auto rounded py-12 px-5 shadow-md l_wrap">
    <n-form :model="model" ref="formRef" :rules="rules">
      <n-form-item path="email" label="Email">
        <!-- <n-input v-model:value="model.email" @keydown.enter.prevent type="email" placeholder="adresse@email.fr"/> -->
        <n-auto-complete @keydown.enter.prevent :options="emailAutocomplete" v-model:value="model.email" placeholder="adresse@email.fr" />
      </n-form-item>
      <n-form-item path="name" label="Name">
        <n-input v-model:value="model.name" @keydown.enter.prevent placeholder="Nom d'utilisateur"/>
      </n-form-item>
      <n-popover :overlap="false" placement="top" trigger="hover">
        <template #trigger>
          <n-form-item path="password" label="Password**">
            <n-input v-model:value="model.password" @input="handlePasswordInput" type="password" @keydown.enter.prevent placeholder="Mot de passe"/>
          </n-form-item>
        </template>
        <p>Le mot de passe doit comprendre au moins {{ nbCaractere }} caractères</p>
      </n-popover>
      <n-form-item
        first
        path="reenteredPassword"
        label="Re-enter Password"
        ref="rPasswordFormItemRef"
      >
        <n-input
          :disabled="!model.password"
          v-model:value="model.reenteredPassword"
          type="password"
          @keydown.enter.prevent
          placeholder="Répétez Mot de passe"
        />
      </n-form-item>
      <n-button :disabled="model.reenteredPassword === null || btnDisabled" class="w-full mb-5" type="primary" @click="handleValidateButtonClick">S'inscrire</n-button>
    </n-form>
    <footer>
      <n-divider class="text-sm" title-placement="center">ou</n-divider>
      <router-link class="block text-center text-sm" to="/login">se connecter</router-link>
    </footer>
  </div>
</div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { NButton, NForm, NFormItem, NInput, NAutoComplete, NDivider, useNotification, NPopover } from 'naive-ui'
import { useStore } from 'vuex'
import router from '@/router'
export default defineComponent({
  name: 'loginPage',
  components: {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NAutoComplete,
    NDivider,
    NPopover
  },
  setup () {
    const store = useStore()
    const formRef = ref(null)
    const rPasswordFormItemRef = ref(null)
    const notification = useNotification()
    const nbCaractere = ref(8)
    const btnDisabled = ref(false)
    const modelRef = ref({
      email: null,
      name: null,
      password: null,
      reenteredPassword: null
    })
    const loggedIn = computed(() => {
      return store.state.auth.status.loggedIn
    })
    const emailAutocomplete = computed(() => {
      return ['@gmail.com', '@outlook.com', '@outlook.fr', '@live.fr', '@yahoo.fr'].map((suffix) => {
        if (modelRef.value.email) {
          const prefix = modelRef.value.email.split('@')[0]
          return {
            label: prefix + suffix,
            value: prefix + suffix
          }
        }
      })
    })
    onMounted(() => {
      if (loggedIn.value) {
        router.push('/')
      }
    })

    function createUserAccount () {
      btnDisabled.value = true
      const data = { name: modelRef.value.name, email: modelRef.value.email, password: modelRef.value.reenteredPassword }
      store.dispatch('auth/register', data).then(
        (data) => {
          console.log(data)
          notification.success({
            title: 'Création',
            content: data.message,
            description: 'Vous allez être redirigé',
            duration: 3000
          })
          setTimeout(() => {
            router.push('/login')
          }, 1000)
        }).catch(e => {
        if (e.response) {
          btnDisabled.value = false
          console.log(e.response.data.message)
          notification.error({
            title: e.response.data.message,
            meta: "L'utilisateur est déjà enregistré dans notre base de donnée.",
            duration: 5000
          })
        }
      })
    }
    function validatePasswordStartWith (rule, value) {
      return (
        modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame (rule, value) {
      return value === modelRef.value.password
    }
    return {
      btnDisabled,
      nbCaractere,
      emailAutocomplete,
      createUserAccount,
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules: {
        email: [{
          required: true,
          validator (rule, value) {
            if (!value) {
              return new Error('email is required')
            }
            return true
          },
          trigger: ['input', 'blur']
        },
        {
          required: true,
          validator (rule, value) {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) { //eslint-disable-line
              return new Error('email is not email valid')
            }
            return true
          },
          trigger: ['blur']
        }],
        name: '',
        password: [{
          required: true,
          validator (rule, value) {
            if (value && value.length < nbCaractere.value) { //eslint-disable-line
              return new Error('Le mot de passe doit comprendre au moins 8 caractères')
            } else if (!value) {
              return new Error('Le mot de passe est nécessaire')
            }
            return true
          },
          trigger: ['blur']
        }],
        reenteredPassword: [
          {
            required: true,
            message: 'Re-entered Password is required',
            trigger: ['input', 'blur']
          },
          {
            validator: validatePasswordStartWith,
            message: 'Password is not same as re-entered password!',
            trigger: 'input'
          },
          {
            validator: validatePasswordSame,
            message: 'Password is not same as re-entered password!',
            trigger: ['blur', 'password-input']
          }
        ]
      },
      handlePasswordInput () {
        if (modelRef.value.reenteredPassword) {
          rPasswordFormItemRef.value.validate({
            trigger: 'password-input'
          })
        }
      },
      handleValidateButtonClick (e) {
        e.preventDefault()
        formRef.value.validate((errors) => {
          if (!errors) {
            console.log('Valid')
            createUserAccount()
          } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(modelRef.value.email)) { //eslint-disable-line
            return console.log('error')
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
.register_wrapper {
  width: 100vw;
  height: calc(100vh - 28px);
  display: flex;
  vertical-align: middle;
  justify-content: center;
}
</style>
