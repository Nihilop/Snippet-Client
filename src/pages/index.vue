<template>
  <h1>News / Update feed soon</h1>
</template>

<script>
// @ is an alias to /src
import { ref } from 'vue'
// import { useStore } from 'vuex'
export default {
  name: 'home',
  layout: 'dashboard',
  components: {
  },
  setup () {
    // const store = useStore()
    const test = ref(null)
    console.log(test.value)
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/style/animations.scss';
@import '@/assets/style/variables.scss';

</style>
