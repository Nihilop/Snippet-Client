<template>
  <n-thing title=" ">
    <template #header-extra>
      <n-space>
        <n-button @click="refresh">
          <n-icon>
            <ArrowClockwise20Filled />
          </n-icon>
        </n-button>
        <n-button @click="createPostModal = true">
          <n-icon>
            <Add24Regular />
          </n-icon>
        </n-button>
      </n-space>
    </template>
  </n-thing>
  <n-tabs type="line" tab="blog" size="large">
    <n-tab-pane name="blog" tab="Articles publiés">
      <n-list class="projectsList">
        <n-list-item v-for="(post, index) in publishedList" :key="index" class="liste_item">
          <template #prefix>
            <n-icon :size="16">
              <ShieldCheckmark16Filled style="color: green" />
            </n-icon>
          </template>
          <template #suffix>
            Crée : {{ new Date(post.created_at * 1000 ).toLocaleString() }} <br>
            <span>{{ post.updated_at ? new Date(post.updated_at * 1000 ).toLocaleString() : null }}</span>
          </template>
          <n-thing>
            <!-- <template #avatar>
              <n-avatar :src="`/img/languages/${project.category}.png`"></n-avatar>
            </template> -->
            <template #header>
              <span @click="editPost(post)">{{post.title}}</span>
            </template>
            <template #header-extra>
            </template>
            <template #description>
              <span class="desc-project">{{post.short}}</span>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
    <n-tab-pane name="draws" tab="Brouillons">
      <n-list class="projectsList">
        <n-list-item v-for="(post, index) in drawsList" :key="index" class="liste_item">
          <template #prefix>
            <n-icon :size="16">
              <ShieldCheckmark16Filled style="color: gray" />
            </n-icon>
          </template>
          <template #suffix>
            Crée : {{ new Date(post.created_at * 1000 ).toLocaleString() }} <br>
            <span>{{ post.updated_at ? new Date(post.updated_at * 1000 ).toLocaleString() : null }}</span>
          </template>
          <n-thing>
            <!-- <template #avatar>
              <n-avatar :src="`/img/languages/${project.category}.png`"></n-avatar>
            </template> -->
            <template #header>
              <span @click="editPost(post)">{{post.title}}</span>
            </template>
            <template #header-extra>
            </template>
            <template #description>
              <span class="desc-project">{{post.short}}</span>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
  </n-tabs>
  <n-modal v-model:show="createPostModal" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="createPostModal = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <CreatePostComponent @showUpdate="modalClose" />
      </n-card>
    </n-layout>
  </n-modal>

  <n-modal v-model:show="editPostModal" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="editPostModal = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <EditPostComponent :params="editPostData" @showUpdate="modalClose" />
      </n-card>
    </n-layout>
  </n-modal>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { NTabs, NTabPane, NThing, NButton, NList, NListItem, NIcon, NSpace, NModal, NLayout, NCard } from 'naive-ui'
import { ShieldCheckmark16Filled, ArrowClockwise20Filled, Add24Regular, Dismiss20Regular } from '@vicons/fluent'
import CreatePostComponent from '@/components/blog/create.vue'
import EditPostComponent from '@/components/blog/edit.vue'
export default defineComponent({
  name: 'adminBlog',
  components: {
    NTabs,
    NTabPane,
    NThing,
    NButton,
    NList,
    NListItem,
    NIcon,
    NSpace,
    NModal,
    NLayout,
    NCard,
    ShieldCheckmark16Filled,
    Add24Regular,
    ArrowClockwise20Filled,
    Dismiss20Regular,
    CreatePostComponent,
    EditPostComponent
  },
  setup () {
    const store = useStore()
    const drawsList = ref([])
    const publishedList = ref([])
    const createPostModal = ref(false)
    const editPostModal = ref(false)
    const editPostData = ref({})

    onMounted(async () => {
      drawsList.value = await store.dispatch('blog/DRAWS')
      publishedList.value = await store.dispatch('blog/PUBLISHED')
    })

    async function refresh () {
      drawsList.value = await store.dispatch('blog/DRAWS')
      publishedList.value = await store.dispatch('blog/PUBLISHED')
    }

    function editPost (data) {
      editPostData.value = data
      editPostModal.value = true
    }

    function modalClose () {
      createPostModal.value = false
      editPostModal.value = false
      refresh()
    }

    return {
      modalClose,
      refresh,
      editPostData,
      drawsList,
      publishedList,
      createPostModal,
      editPostModal,
      editPost
    }
  }
})
</script>
