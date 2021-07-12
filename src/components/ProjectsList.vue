<template>
  <div class="searchIn">
    <n-input placeholder="Filtrer les projets" v-model:value="searchProject" round>
      <template #prefix>
        <n-icon>
          <Search28Regular />
        </n-icon>
      </template>
    </n-input>
  </div>
  <n-layout-content class="list_wrapper" :native-scrollbar="false" >
    <ul class="menu_list">
      <li v-for="(project, index) in projectFilter" :class="$store.state.project.project._id === project._id ? 'active' : null" :key="index" @click="windowsWidth <= 380 ? openDocMobile(project) : openDoc(project)">
        <n-h2 class="noSelect">{{project.name}}</n-h2>
        <span class="noSelect">{{project.category}}</span>
      </li>
    </ul>
  </n-layout-content>
</template>
<script>
import { computed, defineComponent, onMounted, ref, watchEffect } from 'vue'
import { NLayoutContent, NH2, NIcon, NInput } from 'naive-ui'
import { Search28Regular } from '@vicons/fluent'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'ListOfProjects',
  components: {
    NInput,
    NLayoutContent,
    NH2,
    NIcon,
    Search28Regular
  },
  setup () {
    const store = useStore()
    const windowsWidth = ref(window.innerWidth)
    const searchProject = ref('')
    const projects = ref(null)
    const projectFilter = computed(() => {
      return projects.value.filter(item => {
        return item.name.toLowerCase().includes(searchProject.value.toLowerCase())
      })
    })

    onMounted(() => {
      window.onresize = () => { windowsWidth.value = window.innerWidth }
      projects.value = store.state.project.categories
    })

    watchEffect(() => {
      projects.value = store.state.project.categories
    })

    function openDocMobile (PID) {
      store.dispatch('project/CID_SELECT', false)
      openDoc(PID)
    }

    function openDoc (PID) {
      store.dispatch('project/SELECT_PROJECT', PID._id)
    }
    return {
      searchProject,
      projectFilter,
      windowsWidth,
      openDocMobile,
      openDoc
    }
  }
})
</script>
<style lang="scss" scoped>
.searchIn {
  position:sticky;
  top:0;
  left:0;
  width:100%;
  padding:24px;
  box-sizing:border-box;
  border-top-left-radius: 8px;
  transition: all 0.5s;
}

.list_wrapper {
  height: calc(100% - 82px);
}
.menu_list {
  padding: 15px 0;
  .active {
    position:relative;
    background:rgba(gray, 40%);
  }
  li {
    padding:5px 24px;
    border-radius:8px;
    margin: 10px auto;
    width:88%;
    background:rgba(gray, 10%);
    cursor: pointer;
    .n-h2 {
      margin:0 !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      background:rgba(gray, 20%);
    }
  }
}
</style>
