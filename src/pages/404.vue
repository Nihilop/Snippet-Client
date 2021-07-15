<template>
  <div class="error-page">
    <div>
      <h1 data-h1="404">404</h1>
      <p data-p="Not found">Not found</p>
    </div>
  </div>
</template>
<script>
export default {
  name: '404NotFound',
  setup () {
    return {
    }
  }
}
</script>
<style lang='scss' scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  width: 100%;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  h1 {
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
  p {
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
  .error-page h1 {
    font-size: 32vw;
  }
  .error-page h1 + p {
    font-size: 8vw;
    line-height: 10vw;
    max-width: 70vw;
  }
}
</style>
