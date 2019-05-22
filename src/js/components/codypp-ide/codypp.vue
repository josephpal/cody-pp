<template>
  <div id="codypp">
     <main>
      <BlocklyContainer class="blocklyContainer"
                        @registerBlockly="registerBlockly"
                        :size="blocklySize"
                        @resized="blockyResized" />
      <CodePreview  class="codePreview"
                    :blocklyWorkspace="blocklyWorkspace"
                    :display="this.showCodePreview ? 'visible' : 'invisible'" />
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
      blocklySize: "sm",
      showCodePreview: true,
    };
  },

  mounted() {

  },

  methods: {
    registerBlockly(instance) {
      this.blocklyWorkspace = instance;
    },

    blockyResized() {
      console.log("Blockly resized!");

      this.showCodePreview = !this.showCodePreview;
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

      .blocklyContainer {
        z-index: 1;
      }

      .codePreview {
        z-index: 2 !important;
      }
    }
  }
</style>
