<template>
  <n-popover :overlap="false" placement="right" trigger="hover">
    <template #trigger>
      <router-link class="PIDLink" exact to='/' @click="resetData">
        <n-icon :size="22" style="margin:auto;">
          <Home28Filled />
        </n-icon>
      </router-link>
    </template>
    <div class="large-text"> {{ $t('utils.home') }}</div>
  </n-popover>
  <n-popover :overlap="false" placement="right" trigger="hover" v-for="(PID, index) in catComputed" :key="index">
    <template #trigger>
      <a class="PIDLink" exact @click="selectedCat(PID[0].category)">
        <img v-if="PID[0].image" :src="``">
        <img v-else :src="`/img/languages/${PID[0].category}.png`">
      </a>
    </template>
    <div class="large-text">{{PID[0].category}}</div>
  </n-popover>
  <n-popover :overlap="false" placement="right" trigger="hover">
    <template #trigger>
      <n-button class="PIDLink" @click="modalAdd = !modalAdd" type="primary">
        <n-icon>
          <Add24Regular />
        </n-icon>
      </n-button>
    </template>
    <div class="large-text"> {{ $t('utils.create') }} {{$t('utils.project') }}</div>
  </n-popover>

  <n-modal v-model:show="modalAdd" :mask-closable="false" >
    <n-layout :native-scrollbar="false" style="width:100vw; height:100vh" content-style="min-height:100vh;">
      <n-card style="display:block; min-height:100vh; padding-top:55px;" title=" " :bordered="false" :native-scrollbar="false" >
        <template #header-extra><n-button class="modalClose" text @click="modalAdd = false"><n-icon :size="35"><Dismiss20Regular /></n-icon></n-button></template>
        <AddProject @showUpdate="modalClose"/>
      </n-card>
    </n-layout>
  </n-modal>
</template>
<script>
import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue'
import { NPopover, useNotification, NIcon, NButton, NModal, NCard, NLayout } from 'naive-ui'
import AddProject from '@/components/AddProject.vue'
import { Home28Filled, Add24Regular, Dismiss20Regular } from '@vicons/fluent'
import { useStore } from 'vuex'
import router from '@/router'
import _ from 'lodash'
export default defineComponent({
  name: 'ListOfProjects',
  components: {
    AddProject,
    NPopover,
    NIcon,
    Home28Filled,
    NButton,
    Add24Regular,
    Dismiss20Regular,
    NModal,
    NCard,
    NLayout
  },
  setup () {
    const store = useStore()
    const categories = ref([])
    const modalAdd = ref(false)
    const notification = useNotification()

    function selectedCat (CID) {
      store.dispatch('project/CATEGORY_SELECTED', CID)
    }

    function modalClose () {
      modalAdd.value = false
    }

    onMounted(async () => {
      await store.dispatch('project/ALL_PROJECTS')
    })

    function resetData () {
      store.dispatch('project/RESET_ALL')
    }

    function logout () {
      notification.warning({
        content: 'Deconnexion réussie',
        duration: 5000
      })
      console.log('deco')
      store.dispatch('auth/logout')
      router.push('/login')
    }

    watchEffect(() => {
      categories.value = store.state.project.projects
    })

    const catComputed = computed(() => {
      return _.groupBy(categories.value, 'category')
    })

    return {
      modalClose,
      modalAdd,
      resetData,
      selectedCat,
      catComputed
    }
  }
})
</script>
<style lang="scss" scoped>
  .PIDLink {
    // background: rgba(#36393F, 90%); // #F2F3F5
    display: flex;
    flex-direction: column;
    margin:12px auto;
    width:40px;
    height: 40px;
    transition:all 0.5s;
    border-radius: 100%;
    text-decoration: none;
    color:inherit;
    cursor: pointer;

    &.router-link-exact-active {
      position:relative;
      &:after {
        position:absolute;
        content: '';
        left:calc(-100% + 20px);
        width: 3px;
        height: 100%;
        border-radius:3px;
        z-index: 1;
        background:#7289da;
      }
    }

    &:first-child {
      margin-top: 24px;
    }
    > img {
      max-width: 100%;
      border-radius: 100%;
      margin:auto;
    }
  }
  .addDoc {
    position:relative;
    width:40px;
    height:40px;
    border-radius:50%;
  }
</style>
