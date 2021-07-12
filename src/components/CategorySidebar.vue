<template>
  <n-popover :overlap="false" placement="right" trigger="hover" v-for="(PID, index) in catComputed" :key="index">
    <template #trigger>
      <a class="PIDLink" exact @click="selectedCat(PID[0].category)">
        <img v-if="PID[0].image" :src="``">
        <img v-else :src="`/img/languages/${PID[0].category}.png`">
      </a>
    </template>
    <div class="large-text">{{PID[0].category}}</div>
  </n-popover>
</template>
<script>
import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue'
import { NPopover, useNotification } from 'naive-ui'
import { useStore } from 'vuex'
import router from '@/router'
import _ from 'lodash'
export default defineComponent({
  name: 'ListOfProjects',
  components: {
    NPopover
  },
  setup () {
    const store = useStore()
    const categories = ref([])
    const notification = useNotification()
    async function selectedCat (CID) {
      store.dispatch('project/CATEGORY_SELECTED', CID)
    }

    onMounted(() => {
      store.dispatch('project/ALL_PROJECTS').then((data) => {
        categories.value = data.data
      }).catch((e) => {
        if (e.response) {
          console.log(e.response)
          logout()
        }
      })
    })

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
</style>
