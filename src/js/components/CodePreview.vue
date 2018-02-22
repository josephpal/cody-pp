<template>
  <div class="code-preview">
    <DropDown
      :options="languages"
      :selected="selectedLanguage"
      @change="onLanguageChange"
    />

    <div class="code-container" v-bar>
      <div class="scrollable">
        <pre v-highlightjs="code"><code :class="languageClass"></code></pre>
      </div>
    </div>

    <div class="buttons">
      <RoundButton :icon="icons.ArrowIcon" :enabled="!isRunning" @click="onSendButtonClicked" />
      <RoundButton :icon="icons.StopIcon" :enabled="isRunning" @click="onStopButtonClicked" />
      <RoundButton :icon="getPlayButtonIcon" @click="onPlayButtonClicked" />
    </div>
  </div>
</template>

<script>
import DropDown from './DropDown';
import RoundButton from './RoundButton';
import Languages from '../enum/Languages';
import Blockly from 'node-blockly/browser';
import { resetLogicCounterVar } from '../utils/blockly/logic';
import { resetLoopsCounterVar } from '../utils/blockly/loops';
import { post } from '../utils/gateway';

import PlayIcon from '../../assets/svg/play.svg';
import StopIcon from '../../assets/svg/stop.svg';
import PauseIcon from '../../assets/svg/stop.svg';
import ArrowIcon from '../../assets/svg/arrow.svg';

export default {
  name: 'CodePreview',

  data() {
    return {
      code: '',
      languages: [{
        id: Languages.CPP,
        name: 'C++'
      },
      {
        id: Languages.ARDUINOCPP,
        name: 'C++ (Arduino)'
      },
      {
        id: Languages.BASIC,
        name: 'Pseudo Code'
      },
      /*{
        id: Languages.BASIC_GER,
        name: 'Pseudo Code (De)'
      },
      {
        id: Languages.JAVASCRIPT,
        name: 'Javascript'
      },*/
      {
        id: Languages.INTERNAL,
        name: 'Internal Code'
      }],
      selectedLanguage: Languages.CPP,
      isRunning: false,
    }
  },

  props: {
    blocklyInstance: {
      type: Object
    }
  },

  mounted() {
    const webSocket = new WebSocket('ws://192.168.4.1');

    webSocket.addEventListener('open', () => setInterval(() => webSocket.send("test message"), 1000));
    //
    webSocket.onmessage = (message) => console.log(message.data);
  },

  watch: {
    blocklyInstance() {
      if (this.blocklyInstance !== null) {
        this.blocklyInstance.addChangeListener(this.updateCodePreview);

        this.updateCodePreview();
      }
    },

    selectedLanguage() {
      this.updateCodePreview();
    }
  },

  computed: {
    //syntax-highlighting
    languageClass() {
      switch(this.selectedLanguage) {
        case Languages.CPP:
          return 'cpp';
        case Languages.ARDUINOCPP:
          return 'cpp';
        case Languages.BASIC:
          return 'cpp';
          break;
        case Languages.BASIC_GER:
          return 'cpp';
        case Languages.JAVASCRIPT:
          return 'cpp';
          break;
        case Languages.INTERNAL:
          return 'cpp';
        default:
          return '';
      }
    },

    icons() {
      return {
        PlayIcon,
        StopIcon,
        ArrowIcon
      };
    },

    getPlayButtonIcon() {
      return this.isRunning ? PauseIcon : PlayIcon;
    }
  },

  methods: {
    onLanguageChange(id) {
      this.selectedLanguage = id;
    },

    updateCodePreview() {
      if (this.blocklyInstance === null) {
        return;
      }

      switch (this.selectedLanguage) {
        case Languages.CPP:
          this.code = Blockly.Cpp.workspaceToCode(this.blocklyInstance);
          break;
        case Languages.ARDUINOCPP:
          this.code = Blockly.ArduinoCpp.workspaceToCode(this.blocklyInstance);
          break;
        case Languages.BASIC:
          this.code = Blockly.basic.workspaceToCode(this.blocklyInstance);
          break;
        case Languages.BASIC_GER:
          this.code = Blockly.basicger.workspaceToCode(this.blocklyInstance);
          break;
        case Languages.JAVASCRIPT:
          //TODO
          break;
        case Languages.INTERNAL:
          resetLogicCounterVar();
          resetLoopsCounterVar();
          this.code = Blockly.interncode.workspaceToCode(this.blocklyInstance);
          break;
        default:
          this.code = '';
      }
    },

    onPlayButtonClicked() {
      this.isRunning = !this.isRunning;

      post('/start').then((response) => {

      }).catch((response) => {

      });
    },

    onStopButtonClicked() {
      post('/stop').then((response) => {

      }).catch((response) => {

      });
    },

    onSendButtonClicked() {
      post('/send').then((response) => {

      }).catch((response) => {

      });
    }
  },

  components: {
    DropDown,
    RoundButton
  }
}
</script>

<style lang="scss">
  @import '../../scss/variables/colors';
  @import '../../scss/mixins/breakpoints';

  .code-preview {
    width: 40%;
    position: relative;

    .code-container {
      .scrollable {
        padding: 60px 20px;
        max-height: calc(100vh - #{$headerHeight});
      }

      .vb-dragger {
        z-index: 5;
        width: 12px;
        right: 0;
        padding: 12px 0;
      }

      .vb-dragger > .vb-dragger-styler {
        border-radius: 5px;
        height: 100%;
        display: block;
        width: 10px;
        background-color: rgba($colorMediumGrey, .4);

        &:hover {
          background-color: rgba($colorMediumGrey, .6);
        }
      }

    }

    .drop-down {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 1;
      opacity: .8;
      transition: opacity .3s;

      &:hover {
        opacity: 1;
      }
    }

    .buttons {
      position: absolute;
      bottom: 20px;
      right: 32px;
      display: flex;
      flex-direction: row-reverse;

      @include respond-to(tablet) {
        flex-direction: column;
      }

      .round-button {
        margin-left: 20px;

        @include respond-to(tablet) {
          margin-top: 10px;
        }
      }
    }

    .hljs {
      background: transparent;
    }
  }
</style>
