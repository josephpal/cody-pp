<template>
  <div id="codypp">
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" :size="blocklySize"/>
      <!--<CodePreview :blocklyWorkspace="blocklyWorkspace" />-->
     </main>
  </div>
</template>

<script>
import Blockly from 'node-blockly/browser';
import BlocklyContainer from './BlocklyContainer';
import CodePreview from './CodePreview';

export default {
  name: 'codypp',

  data() {
    return {
      blocklyWorkspace: null,
      blocklySize: "sm"
    };
  },

  mounted() {
    setTimeout(() => {
      this.blocklySize = "bg";
    }, 2000);
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
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

  #codypp {
    main {
      display: flex;
    }
  }
</style>
