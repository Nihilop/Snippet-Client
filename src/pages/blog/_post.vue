<template>
  <n-spin size="large" v-if="loading"/>
  <article v-else class="article">
    <header class="article--header">
      <img class="header--banner" :src="article.banner ? article.banner  : '/img/placeholder_article.jpg'" />
      <n-thing class="header--info">
        <template #header>
          <n-h1 class="header--title">{{article.title}}</n-h1>
        </template>
        <template #description>
          <n-space>
            <n-avatar :size="20" :src="article.author_detail.avatar" />
            <span style="font-weight: bold;">By {{article.author_detail.user}}</span>{{ new Date(article.created_at * 1000 ).toLocaleString() }}
          </n-space>
        </template>
      </n-thing>
    </header>
    <section class="article--content">
      <n-thing class="article--info">
        <template #header>
          <n-tag type="success" v-if="article.categories === 'Release'">{{article.categories}}</n-tag>
          <n-tag type="info" v-else-if="article.categories === 'News'">{{article.categories}}</n-tag>
          <n-tag type="warning" v-else-if="article.categories === 'Update'">{{article.categories}}</n-tag>
          <n-tag v-else>{{article.categories}}</n-tag>
        </template>
        <template #header-extra>
          <n-space>
            <n-button text @click="likePost" >
              <template #icon>
                <n-icon :size="28" style="margin-top:-5px">
                  <Heart16Filled v-if="article.likes.includes(uuid)" style="color:#e74c3c"/>
                  <Heart16Regular v-else/>
                </n-icon>
              </template>
              <span style="margin: auto 10px">{{article.likes.length}}</span>
            </n-button>
            <n-button text @click="editArticle = true" v-if="$store.state.user.currentUser.admin">
              <template #icon>
                <n-icon :size="18" style="margin-top:7px">
                  <Edit20Regular />
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </template>
      </n-thing>
      <n-thing>
        <template #header>
          <Markdown :source="article.short" />
        </template>
        <Markdown :source="article.content" />
      </n-thing>
    </section>
    <div class="comments">
      <n-button text >
        <template #icon>
          <n-icon :size="18" style="margin-top:-5px">
            <Comment20Regular />
          </n-icon>
        </template>
        <span>Commentaires ({{article.comments.length}})</span>
      </n-button>
      <n-space vertical>
        <n-input type="textarea" v-model:value="commentaireInput" placeholder="Donne ton avis !"/>
        <n-space justify="end">
          <n-button class="sendComments" type="info" @click="commentsPost">Envoyer</n-button>
        </n-space>
      </n-space>
    </div>
    <n-spin size="large" v-if="comsLoading"/>
    <ul v-else class="list">
      <li class="commentaire" v-for="(com, index) in article.comments" :key="index">
        <n-card>
          <n-thing>
            <template #avatar>
              <n-avatar :src="com.avatar" />
            </template>
            <template #header>
              {{com.author}}
            </template>
            <template #header-extra>
              <n-space>
                {{ new Date(com.date * 1000 ).toLocaleString() }}
                <n-button v-if="$store.state.user.currentUser.admin || com.id === $store.state.user.currentUser._id" text @click="deleteComment(com)">
                  <template #icon>
                    <n-icon :size="18">
                      <Delete28Regular />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </template>
            <template #description>
              {{com.content}}
            </template>
          </n-thing>
        </n-card>
        <ul class="responses_commentaire list" v-if="com.responses.length > 0">
          <li v-for="(resp, index) in com.responses" :key="index">
            <n-card>
              <n-thing>
                <template #avatar>
                  <n-avatar :src="resp.avatar" />
                </template>
                <template #header>
                  {{resp.author}} répond à {{com.author}}
                </template>
                <template #header-extra>
                  {{ new Date(resp.date * 1000 ).toLocaleString() }}
                </template>
                <template #description>
                  {{resp.content}}
                </template>
              </n-thing>
            </n-card>
          </li>
        </ul>
      </li>
    </ul>
  </article>
  <n-modal v-model:show="editArticle" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="editArticle = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <EditPostComponent :params="article" @showUpdate="modalClose" />
      </n-card>
    </n-layout>
  </n-modal>
</template>
<script>
import { defineComponent, onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { NSpin, NThing, NAvatar, NH1, NSpace, NButton, NIcon, NTag, NInput, NCard, NLayout, NModal } from 'naive-ui'
import { Heart16Regular, Heart16Filled, Comment20Regular, Delete28Regular, Edit20Regular, Dismiss20Regular } from '@vicons/fluent'
import EditPostComponent from '@/components/blog/edit.vue'
import MarkdownIt from 'markdown-it'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItTaskList from 'markdown-it-task-list'
export default defineComponent({
  name: 'postDetails',
  layout: 'dashboard',
  components: {
    NSpin,
    NThing,
    NAvatar,
    NSpace,
    NH1,
    NButton,
    NIcon,
    NTag,
    NInput,
    NCard,
    NLayout,
    NModal,
    // Icons:
    Heart16Regular,
    Heart16Filled,
    Comment20Regular,
    Delete28Regular,
    Edit20Regular,
    Dismiss20Regular,
    // Components:
    EditPostComponent
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const editArticle = ref(false)
    const loading = ref(true)
    const comsLoading = ref(false)
    const article = ref(null)
    const commentaireInput = ref(null)
    const auid = ref(null)
    const uuid = ref(null)

    onMounted(async () => {
      auid.value = route.params.post
      uuid.value = store.state.user.currentUser._id
      await refresh()
    })

    watchEffect(() => {
      if (article.value) {
        loading.value = false
      }
    })

    async function modalClose () {
      await refresh()
      editArticle.value = false
    }

    async function refresh () {
      article.value = await store.dispatch('blog/FIND', auid.value)
    }

    async function commentsPost () {
      comsLoading.value = true
      const data = {
        postID: auid.value,
        data: {
          id: store.state.user.currentUser._id,
          author: store.state.user.currentUser.name,
          avatar: store.state.user.currentUser.avatar,
          date: parseInt((new Date().getTime() / 1000).toString()),
          content: commentaireInput.value,
          responses: []
        }
      }
      await store.dispatch('blog/ADD_COMMENT', data)
      await refresh()
      commentaireInput.value = ''
      comsLoading.value = false
    }

    async function deleteComment (com) {
      const data = {
        postID: auid.value,
        data: com
      }
      await store.dispatch('blog/REMOVE_COMMENT', data)
      await refresh()
    }

    async function likePost () {
      const data = {
        postID: auid.value,
        userID: uuid.value
      }
      await store.dispatch('blog/LIKE_POST', data)
      await refresh()
    }
    return {
      modalClose,
      editArticle,
      commentaireInput,
      likePost,
      commentsPost,
      deleteComment,
      uuid,
      article,
      loading,
      comsLoading
    }
  }
})
</script>
<style lang="scss" scoped>
.article {
  max-width: 1200px;
  margin:auto;
  &--header {
    position:relative;
    overflow: hidden;
    display: flex;
    border-radius: 8px;
    max-height: 500px;
    height: 100%;
    margin:auto;
    &:before {
      position: absolute;
      content: '';
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(black,70%) 0%, transparent 100%)
    }
    .header--info {
      position:absolute;
      bottom: 5%;
      left: 5%;
      right:5%;
    }
    .header--banner {
      object-fit: cover;
      object-position: center;
      max-width: 100%;
    }
    .header--title {
      display: block;
      margin-bottom: 0 !important;
    }
  }
  &--content {
    margin:55px auto;
    .article--info {
      position:relative;
      width:100%;
      display: block;
      margin: 25px 0 !important;
    }
  }
  .commentaire {
    margin:5px auto;
    &:first-child {
      margin-top: 55px;
    }
    .responses_commentaire {
      position:relative;
      padding-left:50px;
      margin-top: 4px;
      box-sizing: border-box;
      &:before {
        position:absolute;
        content: '↪️';
        left:0;
        top:50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
