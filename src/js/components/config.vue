<template>
  <div id="config">
    <Header />
     <main>
      <div>Configuration page...</div>
     </main>
  </div>
</template>

<script>
import Header from './Header';

export default {
  name: 'config',

  data() {
    return {  };
  },

  methods: {

  },

  components: {
    Header
  }
};
</script>

<style lang="scss">
  #config {
    main {
      display: flex;
    }
  }
</style>
