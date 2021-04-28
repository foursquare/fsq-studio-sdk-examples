<template>
  <div id="app">
    <UnfoldedMap />
  </div>
</template>

<script>
import UnfoldedMap from './components/UnfoldedMap.vue'

export default {
  name: 'App',
  components: {
    UnfoldedMap
  }
}
</script>

<style lang="scss">
html, 
body {
    height: 100%;
    overflow: hidden;
}
body {
  font-family: 'Graphik Web';
  margin: 0px;

  iframe {
    border: none;
  }
}
</style>
