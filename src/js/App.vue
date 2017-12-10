<template>
  <div id="app">
    <Header />
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" />
      <CodePreview :blocklyInstance="blocklyInstance" />
     </main>
  </div>
</template>

<script>
import BlocklyContainer from './components/BlocklyContainer';
import Header from './components/Header';
import CodePreview from './components/CodePreview';

export default {
  name: 'app',

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
  #app {
    main {
      display: flex;
    }
  }
</style>
