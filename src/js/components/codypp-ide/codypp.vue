<template>
  <div id="codypp">
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" />
      <CodePreview :blocklyWorkspace="blocklyWorkspace" />
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
      blocklyWorkspace: null
    };
  },

  methods: {
    registerBlockly(instance) {
      this.blocklyWorkspace = instance;
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
