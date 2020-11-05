<template>
  <div class="blockly-container" :class="size">
    <div class="hide-button">
      <SemiCircleButton @click="onHideButtonClicked" />
    </div>

    <div class="toolbox-footer">
      <div class="language-button">
        <toggle-button @change="onChangeEventHandler"
                       :value="this.languageSelect"
                       :color="{checked: '#4e5156', unchecked: '#4e5156'}"
                       :labels="{checked: 'EN', unchecked: 'DE'}" />
      </div>

      <div class="version-tag">
        <a>r-1.2.1</a>
      </div>
    </div>


    <div id="blockly"/>
  </div>
</template>

<script>
/* global __PUBLIC_PATH__ */

import Vue from 'vue';
import * as Blockly from 'blockly';
import { ToggleButton } from 'vue-js-toggle-button';
import SemiCircleButton from './SemiCircleButton';

import '../../utils/blockly/cpp';
import '../../utils/blockly/arduinocpp';
import '../../utils/blockly/basic';
import '../../utils/blockly/basicger';
import '../../utils/blockly/javascript';
import '../../utils/blockly/interncode';
import '../../utils/blockly/lua';

import '../../utils/blockly/math';
import '../../utils/blockly/logic';
import '../../utils/blockly/loops';
import '../../utils/blockly/text';

import '../../utils/blockly/custom_blocks';
import '../../utils/blockly/custom_blocks_syntax';

import { xmlGer } from '../../utils/blockly/toolbox';
import { xmlEng } from '../../utils/blockly/toolbox';
import config from '../../../../config';

export default {
  name: 'BlocklyContainer',

  data() {
    return {
      size: "sm",
      languageSelect: false,
    };
  },



  mounted() {
    this.createBlockly();
  },

  watch: {
    size() {
      // console.log("watch: " + this.size);
      this.updateBlockly();
    }
  },

  methods: {
    onChangeEventHandler() {
      this.languageSelect = !this.languageSelect;

      const workspace = Blockly.getMainWorkspace();
      if ( this.languageSelect ) {
        workspace.updateToolbox(xmlEng);
      } else {
        workspace.updateToolbox(xmlGer);
      }

    },

    updateBlockly() {
      // this seems to be unnecessary, but without the timeout, the svg elements wont be resized
      // TODO: maybe we have to update the svg element with the next vm.nextTick() render step ?!

      setTimeout(() => {
        Blockly.svgResize(Blockly.getMainWorkspace());
      }, 0);
    },

    createBlockly() {
      const blocklyWorkspace = Blockly.inject("blockly", {
        toolbox: Blockly.Xml.textToDom(!this.languageSelect ? xmlGer : xmlEng),
        media: process.env.NODE_ENV === 'production' ? __PUBLIC_PATH__ : '/static/',
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2
        },
        trashcan: true,
        sounds: false
      });

      this.$emit('registerBlockly', blocklyWorkspace);
    },

    onHideButtonClicked() {
      if( this.size === "sm" ) {
        this.size = "bg";
      } else {
        this.size = "sm";
      }

      this.$emit('resized');
    }
  },

  components: {
    SemiCircleButton,
    ToggleButton
  }
};
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';

  $boxShadow: 0 0 10px $colorDarkestGrey;

  .blockly-container {
    position: relative;
    height: calc(100vh - #{$headerHeight});

    &.sm {
      width: 60%;
    }

    &.bg {
      width: 100%;
    }

    .hide-button {
      position: absolute;
      right: 0px;
      width: 64px;

      float: right;
      display: flex;
      align-items: center;
      justify-content: center;

      height: calc(100vh - #{$headerHeight});

      .semicircle-button {
        z-index: 2 !important;
        margin-left: auto;
        opacity: 1;
        transition: ease-out .2s;
        transition-delay: .2s;

        &:hover {
          margin-left: auto;
          opacity: 1;
          transition: ease-in .2s;
        }
      }
    }

    .toolbox-footer {
      position: absolute;
      left: 0px;
      bottom: 20px;
      width: 111px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      z-index: 2 !important;

      .language-button {
        margin: 7px;
      }

      .version-tag {
        font-size: 0.85em;
      }
    }

    #blockly {
      position: absolute;
      z-index: 1;

      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      width: 100%;
    }

    .blocklyToolboxDiv {
      background-color: $colorDarkBlue;
      box-shadow: $boxShadow;
      min-width: 111px;

      .blocklyTreeRoot {
        padding: 0;

        .blocklyTreeRow {
        	padding: 10px 20px;
          margin: 0;
        	height: auto;
        	cursor: pointer;
          transition: background-color .2s;

          &:hover {
            background-color: $colorBlue;
          }

          .blocklyTreeLabel {
            cursor: pointer;
          }
        }
      }
    }

    .blocklyFlyoutBackground {
      fill: $colorBlue;
    }

    .blocklySvg {
      background-color: $colorDarkestBlue;
      width: 101%; // hide shitty border
      height: 101%; // hide shitty border
      margin-top: -1px; // hide shitty border
      box-shadow: inset $boxShadow;
    }

    .blocklyScrollbarHandle {
      fill: rgba($colorMediumGrey, .4);
      transition: fill .15s;
    }

    .blocklyScrollbarBackground:hover + .blocklyScrollbarHandle, .blocklyScrollbarHandle:hover {
      fill: rgba($colorMediumGrey, .6);
    }

    .blocklyZoom > image {
      transition: opacity .15s;
    }

    .blocklyTreeLabel, .blocklyText {
      font-family: 'Roboto', sans-serif;
    }

    .toolboxLabelStyle > .blocklyFlyoutLabelText {
      font-family: 'Roboto', sans-serif;
      fill: white;
    }
  }

  .vue-js-switch .v-switch-label.v-left {
    font-family: 'Roboto', sans-serif;
    fill: white;
  }

  .vue-js-switch .v-switch-label.v-right {
    font-family: 'Roboto', sans-serif;
    fill: white;
  }
</style>
