<template>
  <div v-if="project !== false">
    <header class="zoom">
      <div class="title">
        <h1>{{project.name}}</h1>
        <p>{{project._id}}</p>
      </div>
    </header>

    <main role="main" class="content">
      <div class="container">
        <h1 class="content_title">{{project.name}}</h1>
        <div class="project_info">
          <p class="details">Créer le: {{ new Date(project.created_at * 1000).toLocaleString() }}</p>
          <p class="details">Mis à jour: {{ new Date(project.created_at * 1000).toLocaleString() }}</p>
        </div>
        <p class="description">
          <Markdown :source="project.description" />
        </p>
        <ul>
          <li v-for="(item, index) in project.code" :key="index">
            <h1>{{item.file}}</h1>
            <prism-editor class="my-editor prism-editor__textarea" v-model="item.code" :highlight="highlighter" line-numbers :readonly="true"></prism-editor>
            <p>{{item.description}}</p>
          </li>
        </ul>
      </div>
    </main>
  </div>
  <div v-else>
    <div class="error-page">
      <div>
        <h1 class="error-title" data-h1="ERROR">ERROR</h1>
        <p class="error-sub" data-p="Projet privé">Projet privé</p>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
export default defineComponent({
  name: 'projectUID',
  layout: 'default',
  components: {
    PrismEditor
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const project = ref(null)
    onMounted(() => {
      const PID = route.params.uid
      store.dispatch('project/GET_PUBLIC_PROJECT', PID).catch(e => {
        if (e.response) {
          console.log(e.response.status)
        }
      })
    })

    function highlighter (code) {
      return highlight(code, languages.js)
    }

    watchEffect(() => {
      project.value = store.state.project.shareProject
    })

    return {
      project,
      highlighter
    }
  }
})
</script>
<style lang='scss' scoped>
header{
  position: sticky;
  top:0;
  left: 0;
  width: 100%;
  .title{
    text-align: center;
    margin:auto;
    padding: 10% 0;
    h1{
      font-size: 3vw;
      line-height: 1.125;
      text-transform: uppercase;
    }
  }
}
.content {
  position: relative;
  padding: 2em 0;
  line-height: 1.6;
  color: #65676f;
  background-color: rgba(20,20,20, 1);
  text-align: justify;
  min-height: 100%;
  &:before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 50px;
    background: -webkit-linear-gradient( bottom , rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0));
    background: linear-gradient(to top, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0));
  }
  .container {
    width: 90%;
    max-width: 1024px;
    margin: 0 auto;
    &:after {
      content: '';
      display: table;
      clear: both;
    }
  }
  .content_title {
    font-size: 30px;
    color:white;
  }
  p.description {
    margin: 2em 0;
    background: #141418;
    padding: 25px 15px;
    box-sizing: border-box;
    border-radius: 8px;
  }
}
.project_info {
  p.details {
    margin: 0;
    font-size: 0.9em;
  }
}
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px !important;
  line-height: 1.5;
  padding: 24px 5px;
  border-radius: 8px;
  margin: 15px 0;
}

.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  h1.error-title {
    font-size: 20vh;
    width:100%;
    font-weight: bold;
    position: relative;
    margin: -8vh 0 0 0;
    padding: 0;
    &:after {
      content: attr(data-h1);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      color: transparent;
      /* webkit only for graceful degradation to IE */
      background: -webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176, #b98acc, #69a6ce, #9b59b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 400%;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.25);
      animation: animateTextBackground 10s ease-in-out infinite;
    }
  }
  p.error-sub {
    color: #c6c3d1;
    font-size: 6vh;
    font-weight: bold;
    line-height: 10vh;
    position: relative;
    text-transform: uppercase;
    text-shadow: inset 0px 1px 2px rgba(2, 2, 2, 0.5);
  }
}
@keyframes animateTextBackground {
  0% {
    background-position: 0 0;
  }
  25% {
    background-position: 100% 0;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0 100%;
  }
  100% {
    background-position: 0 0;
  }
}
@media (max-width: 767px) {
  .error-page h1.error-title {
    font-size: 32vw;
  }
  .error-page h1.error-title + p.error-sub {
    font-size: 8vw;
    line-height: 10vw;
    max-width: 70vw;
  }
}
</style>
