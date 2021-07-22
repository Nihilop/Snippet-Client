<route>
{
  "name": "homeDashboard",
  "meta": {
    "requiresAuth": true
  }
}
</route>
<template>
<div class="posts">
  <n-card content-style="padding: 0px !important;" style="border-radius: 8px; margin: 24px auto; border:none; overflow:hidden" v-for="post in articles" :key="post">
    <div class="blog-header">
      <div class="blog-cover">
        <img class="imageCover" :src="post.banner ? post.banner  : '/img/placeholder_article.jpg'" />
        <div class="header-contents">
          <n-thing class="header-author">
            <template #avatar>
              <n-avatar :size="22" :src="post.author_detail.avatar"></n-avatar>
            </template>
            <template #header>
              {{post.author_detail.user}}
            </template>
          </n-thing>
          <n-thing class="header-title">
            <template #header>
              <router-link :to="'/blog/' + post._id"><n-h1 class="article-title">{{post.title}}</n-h1></router-link>
            </template>
            <template #header-extra>
              <n-tag type="success" v-if="post.categories === 'Release'">{{post.categories}}</n-tag>
              <n-tag type="info" v-else-if="post.categories === 'News'">{{post.categories}}</n-tag>
              <n-tag type="warning" v-else-if="post.categories === 'Update'">{{post.categories}}</n-tag>
              <n-tag v-else>{{post.categories}}</n-tag>
            </template>
          </n-thing>
        </div>
      </div>
    </div>
    <div class="blog-body">
        <Markdown v-if="post.short !== null" :source="post.short" />
      <!-- <div class="blog-tags">
        <ul>
          <li>{{post.categories}}</li>
        </ul>
      </div> -->
    </div>
    <div class="blog-footer">
      <n-thing>
        <template #header>
          <span style="font-size:0.7em">{{ new Date(post.created_at * 1000 ).toLocaleString() }}</span>
        </template>
        <template #header-extra>
          <n-space>
            <n-button text @click="likePost(post._id)">
              <template #icon>
                <n-icon :size="28" style="margin-top:-5px">
                  <Heart16Filled v-if="post.likes.includes(uuid)" style="color:#e74c3c"/>
                  <Heart16Regular v-else/>
                </n-icon>
              </template>
              <span style="margin: auto 10px">{{post.likes.length}}</span>
            </n-button>
            <n-button text >
              <template #icon>
                <n-icon :size="28" style="margin-top:-5px">
                  <Comment20Regular />
                </n-icon>
              </template>
              <span style="margin: auto 10px">{{post.comments.length}}</span>
            </n-button>
          </n-space>
        </template>
      </n-thing>
    </div>
  </n-card>
</div>
</template>

<script>
// @ is an alias to /src
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { NThing, NAvatar, NCard, NH1, NButton, NIcon, NTag, NSpace } from 'naive-ui'
import { Heart16Filled, Heart16Regular, Comment20Regular } from '@vicons/fluent'
export default {
  name: 'home',
  layout: 'dashboard',
  components: {
    NThing,
    NAvatar,
    NH1,
    NCard,
    NButton,
    NIcon,
    NTag,
    NSpace,
    Heart16Filled,
    Heart16Regular,
    Comment20Regular
  },
  setup () {
    const store = useStore()
    const articles = ref(null)
    const uuid = ref(null)
    onMounted(async () => {
      const published = await store.dispatch('blog/PUBLISHED')
      articles.value = published
      uuid.value = store.state.user.currentUser._id
    })
    async function likePost (auid) {
      const data = {
        postID: auid,
        userID: uuid.value
      }
      await store.dispatch('blog/LIKE_POST', data)
      const published = await store.dispatch('blog/PUBLISHED')
      articles.value = published
    }
    return {
      likePost,
      uuid,
      articles
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/animations.scss';
@import '@/assets/style/variables.scss';
// Blog container
//-------------------------
.posts {
  max-width: 1024px;
  margin:auto;
}
.blog-body {
  padding: 24px;
  box-sizing: border-box;
}
.blog-footer {
  padding: 12px 15px;
  box-sizing: border-box;
}

.blog-header {
  position:relative;
  display: flex;
  height: 20rem;
  width:100%;
}

.light {
  .blog-cover {
    &:before {
      background: linear-gradient(to top, rgba(white,100%) 0%, rgba(white,20%) 100%)
    }
  }
}
.dark {
  .blog-cover {
    &:before {
      background: linear-gradient(to top, rgba(#18181C,100%) 0%, transparent 100%)
    }
  }
}
.blog-cover {
  position:relative;
  display: flex;
  box-shadow: inset hsla(0, 0, 0, .2) 0 64px 64px 16px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  &:before {
    position: absolute;
    content: '';
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .imageCover {
    object-fit: cover;
    object-position: center;
    width: 100%;
  }
  .header-contents {
    position:absolute;
    display: block;
    height: 100%;
    width: 100%;
    .header-title {
      position:absolute;
      bottom: 2%;
      left:2%;
      right:2%;
      .article-title {
        margin: 0 !important;
      }
    }
    .header-author {
      padding: 15px;
      box-sizing: border-box;
    }
  }
}

</style>
