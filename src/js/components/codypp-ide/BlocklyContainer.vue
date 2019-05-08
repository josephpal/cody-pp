<template>
  <div ref="blocklyContainer" class="blockly-container" :class="size">
    <div ref="blockly" id="blockly"/>
  </div>
</template>

<script>
/* global __PUBLIC_PATH__ */

import Blockly from 'node-blockly/browser';
import '../../utils/blockly/custom_blocks';
import '../../utils/blockly/lua';

import '../../utils/blockly/cpp';
import '../../utils/blockly/arduinocpp';
import '../../utils/blockly/basic';
import '../../utils/blockly/basicger';
import '../../utils/blockly/javascript';
import '../../utils/blockly/interncode';

import '../../utils/blockly/dart';
import '../../utils/blockly/math';
import '../../utils/blockly/logic';
import '../../utils/blockly/loops';
import '../../utils/blockly/text';
import '../../utils/blockly/custom_blocks_syntax';
import { xml } from '../../utils/blockly/toolbox';
import config from '../../../../config';

export default {
  name: 'BlocklyContainer',

  props: {
    size: {
      type: String,
      default: "sm",
      validator: (value) => ( ["sm","bg"].includes(value) )
    }
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
    updateBlockly() {
      // console.log("Updating blockly instance");
      // this seems to be unnecessary, but without the timeout, the svg elements wont be resized
      setTimeout(() => {
        Blockly.svgResize(Blockly.getMainWorkspace());
      }, 0);
    },

    createBlockly() {
      const blocklyWorkspace = Blockly.inject("blockly", {
        toolbox: Blockly.Xml.textToDom(xml),
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
    }
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
      width: 70%;
    }

    &.bg {
      width: 100%;
    }

    #blockly {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      width: 100%;
    }

    .blocklyToolboxDiv {
      background-color: $colorDarkBlue;
      box-shadow: $boxShadow;

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
  }
</style>
