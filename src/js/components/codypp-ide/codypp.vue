<template>
  <div id="codypp">
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" />
      <CodePreview :blocklyInstance="blocklyInstance" />
     </main>
  </div>
</template>

<script>
import BlocklyContainer from './BlocklyContainer';
import CodePreview from './CodePreview';

export default {
  name: 'codypp',

  data() {
    return {
      blocklyInstance: null
    };
  },

  methods: {
    registerBlockly(instance) {
      this.blocklyInstance = instance;
    }
  },

  components: {
    BlocklyContainer,
    CodePreview
  }
};
</script>

<style lang="scss">
  #codypp {
    main {
      display: flex;
    }
  }
</style>
