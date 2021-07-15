<template>
  <div class="addProject">
    <n-form :rules="formRules" ref="formRef" :model="modelRef">
      <n-h1>Ajouter un document</n-h1>
      <p style="margin-bottom:24px">{{$t('project.create_message')}}</p>
      <n-space vertical>
        <n-space>
          <n-form-item path="name" :label="$t('project.project_name')">
            <n-input v-model:value="modelRef.name" :placeholder="$t('project.project_name')" size="large"/>
          </n-form-item>
          <n-form-item path="category" :label="$t('project.project_category')">
            <n-select v-model:value="modelRef.category" :options="categories" filterable size="large"/>
          </n-form-item>
        </n-space>
        <n-form-item path="description" :label="$t('project.project_desc')">
          <n-input type="textarea" v-model:value="modelRef.description" placeholder="Description du projet..." />
        </n-form-item>
        <p>{{$t('project.project_md_preview')}}</p>
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
                <n-form-item path="fileTitle" :label="$t('project.project_code_file')">
                  <n-input v-model:value="code.file" placeholder="File name.ts" />
                </n-form-item>
                <n-form-item path="language" :label="$t('project.project_code_language')">
                  <n-select v-model:value="code.language" :options="codeLanguage" filterable/>
                </n-form-item>
                </n-space>
              </template>
              <template #description>
                <n-form-item path="fileCode" :label="$t('project.project_code_code')">
                  <prism-editor class="my-editor" v-model="code.code" :highlight="highlighter" line-numbers></prism-editor>
                </n-form-item>
              </template>
              <template #footer>
                <n-form-item path="fileDescription" :label="$t('project.project_code_desc')">
                  <n-input type="textarea" v-model:value="code.description" placeholder="Notes..." />
                </n-form-item>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-button @click="close" type="error">{{$t('utils.close')}}</n-button>
      </n-space>
    </n-form>
    <transition name="drop-bottom">
      <div id="save_modifications" v-if="mustBeSave">
        <n-card :border="false">
          <div class="save_card">
            <n-thing class="text_wrapper" :title="$t('utils.save')" :description="$t('utils.save_message')" />
            <n-space class="btn_wrapper">
              <n-button class="resetBtn" text @click="close">{{$t('utils.close')}}</n-button>
              <n-button type="success" @click="AddProject">{{$t('utils.save')}}</n-button>
            </n-space>
          </div>
        </n-card>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent, ref, watchEffect } from 'vue'
import { NInput, NForm, NFormItem, NSpace, NSelect, NH1, NButton, NIcon, NThing, NList, NListItem, NCard } from 'naive-ui'
import { Delete20Regular, AddCircle20Regular } from '@vicons/fluent'
import { PrismEditor } from 'vue-prism-editor'
import { useStore } from 'vuex'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
export default defineComponent({
  name: 'addModal',
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
    NCard,
    NListItem,
    PrismEditor,
    // Icons:
    Delete20Regular,
    AddCircle20Regular
  },
  emits: ['showUpdate'],
  setup (props, { emit }) {
    const store = useStore()
    const formRef = ref(null)
    const mustBeSave = ref(false)
    const modelRef = ref({
      name: null,
      category: null,
      description: '',
      code: [{
        file: null,
        code: null,
        language: null,
        description: null
      }]
    })

    watchEffect(() => {
      if (modelRef.value.name && modelRef.value.category) {
        mustBeSave.value = true
      }
    })

    function highlighter (code) {
      return highlight(code, languages.js)
    }

    function close () {
      emit('showUpdate', false)
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

    function AddProject (e) {
      e.preventDefault()
      formRef.value.validate((errors) => {
        if (!errors) {
          store.dispatch('project/CREATE_PROJECT', modelRef.value)
          emit('showUpdate', false)
        } else {
          console.log(errors)
          console.log('nok')
        }
      })
    }

    return {
      close,
      mustBeSave,
      formRef,
      AddProject,
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
          value: 'Javascript'
        },
        {
          label: 'HTML',
          value: 'HTML'
        },
        {
          label: 'PHP',
          value: 'PHP'
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
          value: 'Javascript'
        },
        {
          label: 'PHP',
          value: 'PHP'
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
        },
        {
          label: 'Jquery',
          value: 'Jquery'
        }
      ]
    }
  }
})
</script>
<style lang="scss" scoped>
@import '@/assets/style/variables.scss';
.mardown_preview {
  background: $secondary;
  border-radius: 10px;
  padding: 24px;
  box-sizing: border-box;
}

.addProject {
  max-width:80%;
  margin:auto;
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
