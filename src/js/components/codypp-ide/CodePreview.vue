<template>
  <div class="code-preview">
    <input
      name="fileSaver"
      id="fileSaver"
      type="file"
      ref="fileInput"
      @change="onFileUpload"
    />
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
      <RoundButton icon="arrow" :enabled="webSocketReady && !isRunning" @click="onSendButtonClicked"
                   :showSpinner="showSendBtnSpinner" />
      <RoundButton icon="stop" :enabled="webSocketReady && isRunning" @click="onStopButtonClicked"
                   :showSpinner="showStopBtnSpinner" />
      <RoundButton icon="play" :enabled="webSocketReady && isReady" @click="onPlayButtonClicked"
                   :showSpinner="showPlayBtnSpinner" />
      <RoundButton icon="load" :enabled="!isRunning" @click="onLoadButtonClicked" :showSpinner="showLoadBtnSpinner" />
      <RoundButton icon="save" :enabled="!isRunning" @click="onSaveButtonClicked" :showSpinner="showSaveBtnSpinner" />
    </div>
  </div>
</template>

<script>
  import DropDown from './DropDown';
  import RoundButton from './RoundButton';
  import Languages from '../../enum/Languages';
  import Blockly from 'node-blockly/browser';
  import { resetLogicCounterVar } from '../../utils/blockly/logic';
  import { resetLoopsCounterVar } from '../../utils/blockly/loops';
  import { asyncWebSocketRequest } from '../../utils/socketUtils';

  import SocketMessages from '../../enum/SocketMessageTypes';

  import saveAs from '../../utils/FileSaver';

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
        selectedLanguage: Languages.ARDUINOCPP,
        isRunning: false,
        isPaused: false,
        isReady: false,
        webSocketReady: false,

        // spinner state
        showPlayBtnSpinner: false,
        showStopBtnSpinner: false,
        showSendBtnSpinner: false,
        showSaveBtnSpinner: false,
        showLoadBtnSpinner: false
      };
    },

    props: {
      blocklyWorkspace: {
        type: Object
      }
    },

    mounted() {
      this.socket = new WebSocket(process.env.NODE_ENV === 'production' ? 'ws://192.168.4.1:90' : 'ws://192.168.0.61:90');

      this.socket.addEventListener('open', () => (this.webSocketReady = true));
      this.socket.addEventListener('message', this.onSocketMessage);
    },

    beforeDestroy() {
      this.socket.removeEventListener('message', this.onSocketMessage);
    },

    watch: {
      blocklyWorkspace() {
        if (this.blocklyWorkspace !== null) {
          this.blocklyWorkspace.addChangeListener(this.updateCodePreview);

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
        switch (this.selectedLanguage) {
          case Languages.CPP:
            return 'cpp';
          case Languages.ARDUINOCPP:
            return 'cpp';
          case Languages.BASIC:
            return 'cpp';
          case Languages.BASIC_GER:
            return 'cpp';
          case Languages.JAVASCRIPT:
            return 'cpp';
          case Languages.INTERNAL:
            return 'cpp';
          default:
            return '';
        }
      },

      playButtonIcon() {
        return !this.isRunning || this.isPaused ? PlayIcon : PauseIcon;
      }
    },

    methods: {
      onLanguageChange(id) {
        this.selectedLanguage = id;
      },

      updateCodePreview() {
        if (this.blocklyWorkspace === null) {
          return;
        }

        switch (this.selectedLanguage) {
          case Languages.CPP:
            this.code = Blockly.Cpp.workspaceToCode(this.blocklyWorkspace);
            break;
          case Languages.ARDUINOCPP:
            this.code = Blockly.ArduinoCpp.workspaceToCode(this.blocklyWorkspace);
            break;
          case Languages.BASIC:
            this.code = Blockly.basic.workspaceToCode(this.blocklyWorkspace);
            break;
          case Languages.BASIC_GER:
            this.code = Blockly.basicger.workspaceToCode(this.blocklyWorkspace);
            break;
          case Languages.JAVASCRIPT:
            //TODO
            break;
          case Languages.INTERNAL:
            this.code = this.getInternalCode();
            break;
          default:
            this.code = '';
        }
      },

      getInternalCode() {
        resetLogicCounterVar();
        resetLoopsCounterVar();
        return Blockly.interncode.workspaceToCode(this.blocklyWorkspace);
      },

      prepareInternalCode() {
        return this.getInternalCode()
          .replace('#Start;', '')
          .replace('#Stop;', '')
          .replace(/\n|\s/g, '')
          .concat(';');
      },

      onPlayButtonClicked() {
        this.showPlayBtnSpinner = true;

        return asyncWebSocketRequest(
          this.socket,
          this.isRunning && !this.isPaused ? SocketMessages.PAUSE : SocketMessages.START,
          '',
          this.isRunning && !this.isPaused ? SocketMessages.PAUSED : SocketMessages.RUNNING
        ).then(() => (this.showPlayBtnSpinner = false)).catch(() => (this.showPlayBtnSpinner = false));
      },

      onStopButtonClicked() {
        this.showStopBtnSpinner = true;

        return asyncWebSocketRequest(
          this.socket,
          SocketMessages.STOP,
          '',
          SocketMessages.STOPPED
        ).then(() => (this.showStopBtnSpinner = false)).catch(() => (this.showStopBtnSpinner = false));
      },

      onSendButtonClicked() {
        this.showSendBtnSpinner = true;

        return asyncWebSocketRequest(
          this.socket,
          SocketMessages.SEND,
          this.prepareInternalCode(),
          SocketMessages.READY
        ).then(() => (this.showSendBtnSpinner = false)).catch(() => (this.showSendBtnSpinner = false));
      },

      onSaveButtonClicked() {
        const xml1 = Blockly.Xml.workspaceToDom(this.blocklyWorkspace);
        const xml_text = Blockly.Xml.domToPrettyText(xml1);

        const blob = new Blob([xml_text], { type: 'application/xml' });
        saveAs(blob, 'Cody_pp.xml');
      },

      onLoadButtonClicked() {
        if (this.$refs.fileInput) {
          // trigger input field event
          this.$refs.fileInput.click();
        } else {
          console.warn('File input missing');
        }
      },

      onFileUpload() {
        const files = this.$refs.fileInput.files;

        if(files.length === 0) {
          return;
        }

        const file = files[0];
        const reader = new FileReader();
        let input;

        reader.onloadend = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            input = evt.target.result;

            this.blocklyWorkspace.clear();
            const xml = Blockly.Xml.textToDom(input);
            Blockly.Xml.domToWorkspace(xml, this.blocklyWorkspace);
          }
        };

        const blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);
      },

      onSocketMessage(message) {
        console.warn(message);
        console.log(`Received message ${message.data}`);
        switch (message.data) {
          case SocketMessages.RUNNING:
            this.isReady = true;
            this.isRunning = true;
            this.isPaused = false;
            break;
          case SocketMessages.STOPPED:
            this.isReady = true;
            this.isRunning = false;
            this.isPaused = false;
            break;
          case SocketMessages.PAUSED:
            this.isReady = true;
            this.isPaused = true;
            this.isRunning = true;
            break;
          case SocketMessages.READY:
            this.isReady = true;
            break;
          case SocketMessages.ERROR:
            console.error('Server error');
            break;
          default:
            console.warn('Unknown socket message');
            break;
        }
      }
    },

    components: {
      DropDown,
      RoundButton
    }
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

  #fileSaver {
    display: none;
  }

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
