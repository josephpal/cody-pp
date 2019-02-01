<template>
  <div class="code-preview">
    <input name="fileSaver" id="fileSaver" type ="file"/>
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
      <RoundButton :icon="icons.ArrowIcon" :enabled="webSocketReady && !isRunning" @click="onSendButtonClicked" :showSpinner="showSendBtnSpinner" />
      <RoundButton :icon="icons.StopIcon" :enabled="webSocketReady && isRunning" @click="onStopButtonClicked" :showSpinner="showStopBtnSpinner" />
      <RoundButton :icon="playButtonIcon" :enabled="webSocketReady && isReady" @click="onPlayButtonClicked" :showSpinner="showPlayBtnSpinner" />
      <RoundButton :icon="icons.LoadIcon" :enabled="!isRunning" @click="onLoadButtonClicked" :showSpinner="showLoadBtnSpinner" />
      <RoundButton :icon="icons.SaveIcon" :enabled="!isRunning" @click="onSaveButtonClicked" :showSpinner="showSaveBtnSpinner" />
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

import PlayIcon from '../../../assets/svg/play.svg';
import StopIcon from '../../../assets/svg/stop.svg';
import PauseIcon from '../../../assets/svg/pause.svg';
import ArrowIcon from '../../../assets/svg/arrow.svg';
import LoadIcon from '../../../assets/svg/load.svg';
import SaveIcon from '../../../assets/svg/save.svg';
import SocketMessages from "../../enum/SocketMessageTypes";

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
    }
  },

  props: {
    blocklyInstance: {
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

    icons() {
      return {
        PlayIcon,
        StopIcon,
        ArrowIcon,
        SaveIcon,
        LoadIcon
      };
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
          this.code = this.getInternalCode();
          break;
        default:
          this.code = '';
      }
    },

    getInternalCode() {
      resetLogicCounterVar();
      resetLoopsCounterVar();
      return Blockly.interncode.workspaceToCode(this.blocklyInstance);
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
          this.isRunning && !this.isPaused ? SocketMessages.PAUSED : SocketMessages.RUNNING,
      ).then(() => (this.showPlayBtnSpinner = false)).catch(() => (this.showPlayBtnSpinner = false));
    },

    onStopButtonClicked() {
      this.showStopBtnSpinner = true;

      return asyncWebSocketRequest(
          this.socket,
          SocketMessages.STOP,
          '',
          SocketMessages.STOPPED,
      ).then(() => (this.showStopBtnSpinner = false)).catch(() => (this.showStopBtnSpinner = false));
    },

    onSendButtonClicked() {
      this.showSendBtnSpinner = true;

      return asyncWebSocketRequest(
          this.socket,
          SocketMessages.SEND,
          this.prepareInternalCode(),
          SocketMessages.READY,
      ).then(() => (this.showSendBtnSpinner = false)).catch(() => (this.showSendBtnSpinner = false));
    },

    onSaveButtonClicked() {   //save Button Funktion
      this.showSaveBtnSpinner = true;
      var xml1 = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
      var xml_text = Blockly.Xml.domToPrettyText(xml1);
      //BlocklyStorage.link();
      console.log(xml_text);
      //Exportieren der Datei auf einen lokalen Speicherort

      var blob = new Blob([xml_text], {type: 'text/plain'});
      saveAs(blob, "Cody_pp.xml");
      console.log("backuped");
      //funktioniert!
      //Blockly.mainWorkspace.clear(); //könnte auch den mainWorkspace vorher holen, wie in Funktion onLoadButtonclicked
      this.showSaveBtnSpinner = false;
    },

    onLoadButtonClicked() {   //load Button Funktion
      this.showLoadBtnSpinner = true;

      // trigger input field event
      document.getElementById('fileSaver').click();

      // event listener on "file open dialog confirmed"
      document.getElementById('fileSaver').addEventListener('change', () => {
        var files = document.getElementById('fileSaver').files;

        if (!files.length){
          alert('Zuerst Datei zum Laden auswählen!');
          this.showLoadBtnSpinner = false;
          return;
        }

        var file = files[0];
        var reader = new FileReader();
        var input;

        reader.onloadend = function (evt){
          if (evt.target.readyState === FileReader.DONE){
            input = evt.target.result;
            //console.log(input);
            let workspace = Blockly.getMainWorkspace();
            workspace.clear();
            var xml = Blockly.Xml.textToDom(input);
            Blockly.Xml.domToWorkspace(xml,workspace);
          }
        };

        var blob = file.slice(0, file.size);
        reader.readAsBinaryString(blob);

        this.showLoadBtnSpinner = false;
      });
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
    },
  },

  components: {
    DropDown,
    RoundButton
  }
}
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
