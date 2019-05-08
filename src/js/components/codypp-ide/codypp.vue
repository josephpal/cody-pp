<template>
  <div id="codypp">
     <main>
      <BlocklyContainer @registerBlockly="registerBlockly" :size="blocklySize"/>
      <!--<CodePreview :blocklyWorkspace="blocklyWorkspace" />-->

      <div class="hide-button">
        <RoundButton  :icon="sendButtonIcon"
                      :enabled="true"
                      :showSpinner="false"
                      size="md" />
      </div>
     </main>
  </div>
</template>

<script>
import Blockly from 'node-blockly/browser';
import BlocklyContainer from './BlocklyContainer';
import CodePreview from './CodePreview';
import RoundButton from './RoundButton';

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
    CodePreview,
    RoundButton
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

    .hide-button {
      position: absolute;
      right: 35px;
      top: 50%;

      /deep/ .icon {
        width: auto;
        height: 45%;
      }

      .round-button {
        background-color: rgba($colorMediumGrey, .2);
        box-shadow: 1px 1px 8px $colorDarkestGrey;

        &:hover {
          border: 0;
          background-color: $colorRed;
        }
      }
    }
  }
</style>
