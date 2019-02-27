<template>
  <div id="config">
     <main>
      <InputFieldContainer />
     </main>
  </div>
</template>

<script>
import InputFieldContainer from './InputFieldContainer';

export default {
  name: 'config',

  data() {
    return {  };
  },

  methods: {

  },

  components: {
    InputFieldContainer
  }
};
</script>

<style lang="scss">
  #config {
    main {
      display: flex;
      justify-content: center;
    }
  }
</style>
