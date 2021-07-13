<template>
  <div class="addProject">
    <n-form :rules="formRules" ref="formRef" :model="modelRef">
      <n-h1>Edition: {{$store.state.project.project.name}}</n-h1>
      <p style="margin-bottom:24px">Attention, vous êtes sur la page d'édition de {{$store.state.project.project.name}}, merci de votre attention.</p>
      <n-space vertical>
        <n-space>
          <n-form-item path="name" label="Nom du projet">
            <n-input v-model:value="modelRef.name" placeholder="Nom..." size="large"/>
          </n-form-item>
          <n-form-item path="category" label="Choisissez une catégorie">
            <n-select v-model:value="modelRef.category" :options="categories" filterable size="large"/>
          </n-form-item>
          <n-form-item path="private" :label="`Rendre le projet ${modelRef.private ? 'Public': 'Privé'}`">
            <n-button text @click="privateToPublic" size="large">
              <template #icon>
                <n-icon>
                  <ShieldDismiss20Regular v-if="modelRef.private" style="color: #e74c3c !important"/>
                  <ShieldCheckmark48Regular v-else style="color: #2ecc71 !important"/>
                </n-icon>
              </template>
              Projet : <span style="padding:0 5px;" :style="modelRef.private ? 'color: #e74c3c !important': 'color: #2ecc71 !important'"> {{modelRef.private ? 'Privé': 'Publique'}}</span>
            </n-button>
          </n-form-item>
        </n-space>
        <n-form-item path="description" label="Description">
          <n-input type="textarea" v-model:value="modelRef.description" placeholder="Description du projet..." />
        </n-form-item>
        <p>Markdown preview : </p>
        <Markdown class="mardown_preview" :source="modelRef.description" />
        <n-list bordered>
          <template #footer>
            <n-button type="success" @click="addBlockCode">
              <template #icon>
                <n-icon>
                  <AddCircle20Regular/>
                </n-icon>
              </template>
            </n-button>
          </template>
          <n-list-item v-for="(code, index) in modelRef.code" :key="index">
            <n-thing>
              <template #header-extra>
                <n-button text @click="deleteRow(index)">
                  <template #icon>
                    <n-icon>
                      <Delete20Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              <template #header>
                <n-space>
                <n-form-item path="fileTitle" label="FileName.ts">
                  <n-input v-model:value="code.file" placeholder="File name.ts" />
                </n-form-item>
                <n-form-item path="language" label="Langage">
                  <n-select v-model:value="code.language" :options="codeLanguage" filterable/>
                </n-form-item>
                </n-space>
              </template>
              <template #description>
                <n-form-item path="fileCode" label="block Code">
                  <prism-editor class="my-editor" v-model="code.code" :highlight="highlighter" line-numbers></prism-editor>
                </n-form-item>
              </template>
              <template #footer>
                <n-form-item path="fileDescription" label="Code description">
                  <n-input type="textarea" v-model:value="code.description" placeholder="Notes..." />
                </n-form-item>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-button @click="close" type="error">Fermer sans sauvegarder</n-button>
      </n-space>
    </n-form>
    <transition name="drop-bottom">
      <div id="save_modifications" v-if="mustBeSave">
        <n-card :border="false">
          <div class="save_card">
            <n-thing class="text_wrapper" :title="$t('utils.save')" :description="$t('utils.save_message')" />
            <n-space class="btn_wrapper">
              <n-button class="resetBtn" text @click="resetChange">{{$t('utils.reset')}}</n-button>
              <n-button type="success" @click="EditProject">{{$t('utils.save')}}</n-button>
            </n-space>
          </div>
        </n-card>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, watchEffect } from 'vue'
import { NInput, NForm, NFormItem, NSpace, NSelect, NH1, NButton, NIcon, NThing, NList, NListItem, NCard } from 'naive-ui'
import { Delete20Regular, AddCircle20Regular, ShieldDismiss20Regular, ShieldCheckmark48Regular } from '@vicons/fluent'
import { PrismEditor } from 'vue-prism-editor'
import { useStore } from 'vuex'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
export default defineComponent({
  name: 'EditModal',
  components: {
    NInput,
    NForm,
    NFormItem,
    NSpace,
    NSelect,
    NH1,
    NButton,
    NIcon,
    NThing,
    NList,
    NListItem,
    PrismEditor,
    NCard,
    // Icons:
    Delete20Regular,
    AddCircle20Regular,
    ShieldDismiss20Regular,
    ShieldCheckmark48Regular
  },
  emits: ['showUpdate'],
  props: {
    params: {
      type: Object,
      required: true
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const formRef = ref(null)
    const pid = ref(null)
    const mustBeSave = ref(false)
    const modelRef = ref({
      name: null,
      category: null,
      description: '',
      private: null,
      code: [{
        file: null,
        code: null,
        language: null,
        description: null
      }]
    })

    onMounted(() => {
      modelRef.value.name = props.params.name
      modelRef.value.category = props.params.category
      modelRef.value.description = props.params.description
      modelRef.value.code = props.params.code
      modelRef.value.private = props.params.private
      pid.value = props.params._id
    })

    watchEffect(() => {
      if (modelRef.value.name !== props.params.name ||
          modelRef.value.category !== props.params.category ||
          modelRef.value.description !== props.params.description ||
          modelRef.value.code !== props.params.code ||
          modelRef.value.private !== props.params.private) {
        mustBeSave.value = true
      }
    })

    function resetChange () {
      modelRef.value.name = props.params.name
      modelRef.value.category = props.params.category
      modelRef.value.description = props.params.description
      modelRef.value.code = props.params.code
      modelRef.value.private = props.params.private
    }

    function highlighter (code) {
      return highlight(code, languages.js)
    }

    function close () {
      emit('showUpdate', false)
    }

    function privateToPublic () {
      modelRef.value.private = !modelRef.value.private
    }

    function addBlockCode () {
      const codeBlock = {
        file: null,
        code: null,
        language: null,
        description: null
      }
      modelRef.value.code.push(codeBlock)
    }

    function deleteRow (index) {
      modelRef.value.code.splice(index, 1)
    }

    function EditProject (e) {
      e.preventDefault()
      formRef.value.validate((errors) => {
        if (!errors) {
          console.log('ok', modelRef.value)
          const result = {
            data: modelRef.value,
            pid: pid.value
          }
          store.dispatch('project/UPDATE_PROJECT', result)
          emit('showUpdate', false)
        } else {
          console.log(errors)
          console.log('nok')
        }
      })
    }

    return {
      resetChange,
      close,
      mustBeSave,
      privateToPublic,
      formRef,
      EditProject,
      highlighter,
      deleteRow,
      addBlockCode,
      modelRef,
      formRules: {
        name: [
          {
            required: true,
            message: 'Le nom est requis'
          }
        ],
        category: [
          {
            required: true,
            message: 'La categorie est requise'
          }
        ]
      },
      codeLanguage: [
        {
          label: 'Javascript',
          value: 'javascript'
        },
        {
          label: 'HTML',
          value: 'HTML'
        },
        {
          label: 'CSS',
          value: 'CSS'
        },
        {
          label: 'C++',
          value: 'c++'
        }
      ],
      categories: [
        {
          label: 'Javascript',
          value: 'javascript'
        },
        {
          label: 'Jquery',
          value: 'Jquery'
        },
        {
          label: 'VueJS',
          value: 'VueJS'
        },
        {
          label: 'DenoJS',
          value: 'DenoJS'
        },
        {
          label: 'ReactJS',
          value: 'ReactJS'
        },
        {
          label: 'AngularJS',
          value: 'AngularJS'
        },
        {
          label: 'HTML',
          value: 'HTML'
        },
        {
          label: 'CSS',
          value: 'CSS'
        },
        {
          label: 'SCSS',
          value: 'SCSS'
        }
      ]
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.addProject {
  max-width:80%;
  margin:auto;
}

.mardown_preview {
  background: $secondary;
  border-radius: 10px;
  padding: 24px;
  box-sizing: border-box;
}
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

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
#save_modifications {
  background: #17171C;
  box-shadow: 0 0 5px 8px rgba(#17171C, 10%);
}

#save_modifications {
  position:sticky;
  width:100%;
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
