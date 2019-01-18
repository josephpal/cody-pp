<template>
  <div id="codypp">
    <Header />
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" />
      <CodePreview :blocklyInstance="blocklyInstance" />
     </main>
  </div>
</template>

<script>
import BlocklyContainer from './BlocklyContainer';
import Header from './Header';
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
    Header,
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
