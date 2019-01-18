<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header';

export default {
  name: 'app',

  data() { return {  }; },

  methods: {},

  components: {
    Header
  }
};
</script>

<style lang="scss">

</style>
