<template>
<div class="articles">
  <n-form :rules="formRules" ref="formRef" :model="modelRef">
    <n-h1>Création d'article</n-h1>
    <n-space vertical>
      <n-space>
        <n-form-item path="title" label="Titre">
          <n-input v-model:value="modelRef.title" placeholder="Titre de l'article" size="large"/>
        </n-form-item>
        <n-form-item path="category" label="Catégories">
          <n-select v-model:value="modelRef.categories" :options="categories" filterable size="large"/>
        </n-form-item>
        <n-form-item path="slug" label="Slug (Comment sera composée l'URL)">
          <n-input v-model:value="modelRef.slug" disabled placeholder="..." size="large"/>
        </n-form-item>
        <n-form-item path="draw" label="Brouillon ?">
          <n-switch v-model:value="modelRef.draw" />
        </n-form-item>
        <n-form-item path="author" label="Auteur">
          <n-thing class="project_liste">
            <template #avatar>
              <n-avatar :src="user.avatar"></n-avatar>
            </template>
            <template #header>
              {{user.author}}
            </template>
            <template #description>
              {{user.email}}
            </template>
          </n-thing>
        </n-form-item>
      </n-space>
      <n-form-item path="banner" label=" ">
        <div class="upload-avatar_wrapper" v-if="!preview" >
          <input name="avatar" type="file" accept="image/*" @change="previewImage" class="upload-avatar" id="my-file"/>
        </div>
        <div v-if="preview" class="avatar-preview" @click="reset">
          <img :src="preview || modelRef.banner" />
          <!-- <p class="mb-0">file name: {{ image.name }}</p>
          <p class="mb-0">size: {{ image.size/1024 }}KB</p> -->
        </div>
      </n-form-item>
      <n-form-item path="short" label="Courte description">
        <n-input type="textarea" v-model:value="modelRef.short" placeholder="Preview article..." maxlength="180"/>
      </n-form-item>
      <n-form-item path="content" label="Contenu de l'article">
        <n-input type="textarea" v-model:value="modelRef.content" placeholder="Content article..." :autosize="{ minRows: 10 }"/>
      </n-form-item>

      <n-space>
        <n-button @click="close" type="error">{{$t('utils.close_unsave')}}</n-button>
        <n-button @click="confirmDelete = true" type="warning">{{$t('utils.delete')}}</n-button>
      </n-space>
    </n-space>
  </n-form>
  <transition name="drop-bottom">
    <div id="save_modifications" v-if="mustBeSave">
      <n-card :border="false">
        <div class="save_card">
          <n-thing class="text_wrapper" :title="$t('utils.save')" :description="$t('utils.save_message')" />
          <n-space class="btn_wrapper">
            <n-button class="resetBtn" text @click="close">{{$t('utils.close')}}</n-button>
            <n-button type="success" @click="editPost">{{$t('utils.save')}}</n-button>
          </n-space>
        </div>
      </n-card>
    </div>
  </transition>
  <n-modal v-model:show="confirmDelete" :mask-closable="true" >
    <n-card style="width:600px;" :title="$t('utils.delete')" :bordered="false" :native-scrollbar="false" >
      <span>{{ $t('utils.confirm_delete_post')}}</span>
      <template #footer>
        <n-space>
          <n-button type="error" @click="confirmDelete = false">{{ $t('utils.cancel')}}</n-button>
          <n-button type="success" @click="deletePost">{{ $t('utils.delete')}}</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</div>
</template>
<script>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { NForm, NFormItem, NSpace, NThing, NButton, NH1, NInput, NSelect, NAvatar, NCard, NSwitch, NModal } from 'naive-ui'
export default {
  components: {
    NForm,
    NFormItem,
    NSpace,
    NThing,
    NButton,
    NSelect,
    NAvatar,
    NInput,
    NSwitch,
    NModal,
    NH1,
    NCard
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
    const mustBeSave = ref(false)
    const formRef = ref(null)
    const image = ref(null)
    const preview = ref(null)
    const confirmDelete = ref(false)
    const user = ref({
      author: null,
      avatar: null,
      email: null
    })
    const modelRef = ref({
      title: '',
      author_detail: {
        user: store.state.user.currentUser.name,
        avatar: store.state.user.currentUser.avatar,
        email: store.state.user.currentUser.email
      },
      slug: null,
      banner: null,
      short: null,
      categories: null,
      content: null,
      draw: true
    })
    const slugComputed = computed(() => {
      if (modelRef.value.title) {
        return modelRef.value.title.split(' ').join('-')
      } else {
        return ''
      }
    })

    onMounted(() => {
      // modelRef.value = props.params
      preview.value = props.params.banner
      user.value.author = props.params.author_detail.user
      user.value.avatar = props.params.author_detail.avatar
      user.value.email = props.params.author_detail.email
      modelRef.value.title = props.params.title
      modelRef.value.slug = props.params.slug
      modelRef.value.banner = props.params.banner
      modelRef.value.short = props.params.short
      modelRef.value.content = props.params.content
      modelRef.value.draw = props.params.draw
      modelRef.value.categories = props.params.categories
    })

    watchEffect(() => {
      if (props.params.title !== modelRef.value.title ||
          props.params.slug !== modelRef.value.slug ||
          props.params.banner !== modelRef.value.banner ||
          props.params.short !== modelRef.value.short ||
          props.params.content !== modelRef.value.content ||
          props.params.draw !== modelRef.value.draw ||
          props.params.categories !== modelRef.value.categories) {
        mustBeSave.value = true
      }
      modelRef.value.slug = slugComputed.value
    })

    function editPost (e) {
      e.preventDefault()
      formRef.value.validate((errors) => {
        if (!errors) {
          const data = {
            postID: props.params._id,
            data: modelRef.value
          }
          store.dispatch('blog/UPDATE', data)
          emit('showUpdate', false)
        } else {
          console.log(errors)
          console.log('nok')
        }
      })
    }

    async function deletePost () {
      await store.dispatch('blog/DELETE', modelRef.value._id).catch((e) => {
        if (e.response) {
          console.log(e.response)
        }
      })
      close()
    }

    function previewImage (event) {
      var input = event.target
      if (input.files) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.preview = e.target.result
          modelRef.value.banner = this.preview
          mustBeSave.value = true
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
      mustBeSave.value = false
      if (props.params.value !== modelRef.value.banner) {
        mustBeSave.value = true
      }
    }

    function close () {
      emit('showUpdate', false)
    }
    return {
      deletePost,
      confirmDelete,
      previewImage,
      editPost,
      formRef,
      reset,
      user,
      image,
      preview,
      modelRef,
      close,
      mustBeSave,
      categories: [
        {
          label: 'News',
          value: 'News'
        },
        {
          label: 'Update',
          value: 'Update'
        },
        {
          label: 'Release',
          value: 'Release'
        },
        {
          label: 'Divers',
          value: 'Divers'
        },
        {
          label: 'Annonce',
          value: 'Annonce'
        }
      ],
      formRules: {
        title: [
          {
            required: true,
            message: 'Le titre est requis',
            trigger: ['change', 'input'],
            validator (_, value) {
              if (value !== '') {
                mustBeSave.value = true
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.articles {
  max-width: 1024px;
  margin:auto;
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
  width:100%;
  height: 150px;
  overflow: hidden;
  transition: 0.2s linear all;
  color: #ffffff;
  border: 2px dashed gray;
  > div {
    width:100%;
    height: 100%;
  }
  &:hover {
    transition: ease 0.5s;
    border-color: darken(gray, 5%);
    &:after{
      position:absolute;
      width:100%;
      height: 100%;
      top:0;
      left: 0;
      content: '+';
      line-height: 150px;
      font-size: 3em;
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
  margin:auto;
  max-height: 300px;
  overflow:hidden;
  &:hover {
    transition: ease 0.5s;
    &:after{
      position:absolute;
      width:100%;
      bottom:0;
      top:0;
      left: 0;
      content: '🗑️';
      text-align: center;
      align-items: center;
      background-color: rgba(gray, 60%);
      cursor: pointer;
    }
  }
  > img {
    max-height: 100%;
    width: auto;
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
