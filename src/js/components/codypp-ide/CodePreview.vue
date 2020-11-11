<template>
  <div class="code-preview" :class="display">
    <div class="preview-container">
      <input  name="fileSaver"
              id="fileSaver"
              type="file"
              ref="fileInput"
              @change="onFileUpload"
              accept=".xml" />

      <DropDown :options="languages"
                :selected="selectedLanguage"
                @change="onLanguageChange" />

      <div class="code-container" v-bar>
        <div class="scrollable">
          <pre><code v-html="code"></code></pre>
          <!-- <highlightjs :language="languageClass" :code="code" /> -->
        </div>
      </div>
    </div>

    <div class="buttons" :class="this.display === 'invisible' ? 'right-offset' : ''">
      <RoundButton  class="send-button"
                    icon="arrow"
                    :enabled="webSocketReady && !isRunning"
                    @click="onSendButtonClicked"
                    :showSpinner="showSendBtnSpinner" />
      <RoundButton  class="stop-button"
                    icon="stop"
                    :enabled="webSocketReady && isRunning" @click="onStopButtonClicked"
                    :showSpinner="showStopBtnSpinner" />
      <RoundButton  class="play-button"
                    :icon="playButtonIcon"
                    :enabled="webSocketReady && isReady"
                    @click="onPlayButtonClicked"
                    :showSpinner="showPlayBtnSpinner" />
      <RoundButton  class="load-button"
                    icon="load"
                    :enabled="!isRunning"
                    @click="onLoadButtonClicked"
                    :showSpinner="showLoadBtnSpinner" />
      <RoundButton  class="save-button"
                    icon="save"
                    :enabled="!isRunning"
                    @click="onSaveButtonClicked"
                    :showSpinner="showSaveBtnSpinner" />
      <RoundButton  class="settings-button"
                    icon="settings"
                    :enabled="!(webSocketReady && !isRunning)"
                    @click="onSettingsButtonClicked"
                    :showSpinner="showSettingsBtnSpinner"
                    size="lg" />
    </div>
  </div>
</template>

<script>
  import DropDown from './DropDown';
  import RoundButton from './RoundButton';
  import Languages from '../../enum/Languages';
  import * as Blockly from 'blockly';
  // import { resetLogicCounterVar } from '../../utils/blockly/logic';
  // import { resetLoopsCounterVar } from '../../utils/blockly/loops';

  import languageArduinoCPP from "../../languages/arduinocpp/index"

  import SocketMessages from '../../enum/SocketMessageTypes';

  import saveAs from '../../utils/FileSaver';

  import socketConnector from '../../socketConnector';

  import { readme } from '../../../../static/Readme.txt'
  import { ft32_h } from '../../../../static/ft32_IOobjects.h'
  import { ft32_cpp } from '../../../../static/ft32_IOobjects.cpp'

  import { insert } from '../../utils/String'

  export default {
    name: 'CodePreview',

    data() {
      return {
        code: '',
        languages: [/*{
          id: Languages.CPP,
          name: 'C++'
        },*/
        {
          id: Languages.ARDUINOCPP,
          name: 'C++ (Arduino for FT32)'
        },
        /*{
          id: Languages.BASIC,
          name: 'Pseudo Code'
        },*/
        {
          id: Languages.BLANK,
          name: 'Preview Off'
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
        showSettingsBtnSpinner: false,
        showSaveBtnSpinner: false,
        showLoadBtnSpinner: false,
      };
    },

    props: {
      blocklyWorkspace: {
        type: Object
      },

      display: {
        type: String,
        default: "visible",
        validator: (value) => ( ["visible","invisible"].includes(value) )
      }
    },

    mounted() {
      socketConnector.onClose(this.onSocketClose);
      socketConnector.onOpen(this.onSocketOpen);
      socketConnector.onMessage(this.onSocketMessage);

      // window.addEventListener('beforeunload', this.beforePageDestroyed);
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
        return !this.isRunning || this.isPaused ? 'play' : 'pause';
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
            this.code = languageArduinoCPP.workspaceToCode(this.blocklyWorkspace)
           // this.code = Blockly.ArduinoCpp.workspaceToCode(this.blocklyWorkspace);
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
            var codeUnmodified = this.getInternalCode();
            var codeModified = '';

            console.log(codeUnmodified)

            if(codeUnmodified.includes("#RETURN_0;")) {
              var instructionsArray = codeUnmodified
                                        .replace(/\n|\s/g, '')
                                        .replace('#Start;', '')
                                        .replace('#Stop;', '')
                                        .replace('#RETURN_0;', '')
                                        .split(';');

              for (var i = 0; i < instructionsArray.length; i++) {
                if(instructionsArray[i] !== '') {
                  var reverseParam = '';

                  if(instructionsArray[i].includes("M")) {
                    if(instructionsArray[i][5] !== '2' ) {
                      reverseParam = instructionsArray[i][5] == '0' ? '1' : '0';
                      codeModified += instructionsArray[i].substring(0, 5) + reverseParam + instructionsArray[i].substring(5 + 1) + ';\n';
                    } else {
                      codeModified += instructionsArray[i];
                    }
                  } else {
                    codeModified += instructionsArray[i] + ';\n';
                  }
                }
              }

              var instructionsArrayModified = codeModified
                                                .replace(/\n|\s/g, '')
                                                .split(';');

              console.log(instructionsArray);
              console.log(instructionsArrayModified);

              var index = 0;
              var instrCounter = 0;
              var grouped = [];

              for (var i = 0; i < instructionsArrayModified.length; i++) {

                if(instructionsArrayModified[i].includes("S")) {

                  var instr = 0;
                  for(var j = index; j <= i; j++) {
                    grouped[instrCounter, instr] = instructionsArrayModified[j] + ';\n';
                    instr++;
                  }

                  index = i+1;
                  instrCounter++;

                  console.log("sleep found");
                  console.log(index);
                  console.log(instrCounter);
                }
              }

              console.log(grouped);

              this.code = codeUnmodified.replace('#RETURN_0;', codeModified);

            } else if(codeUnmodified.includes("#RETURN_1;")) {
              this.code = codeUnmodified.replace('#RETURN_1;', '#RETURN_1_MOD;');
            } else {
              this.code = codeUnmodified;
            }

            break;
          default:
            this.code = '';
        }
      },

      getInternalCode() {
        // resetLogicCounterVar();
        // resetLoopsCounterVar();
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

        socketConnector.send(
          this.isRunning && !this.isPaused ? SocketMessages.PAUSE : SocketMessages.START,
          '',
          this.isRunning && !this.isPaused ? SocketMessages.PAUSED : SocketMessages.RUNNING
        ).then(() => (this.showPlayBtnSpinner = false))
        .catch(() => (this.showPlayBtnSpinner = false));
      },

      onStopButtonClicked() {
        this.showStopBtnSpinner = true;

        socketConnector.send(
          SocketMessages.STOP,
          '',
          SocketMessages.STOPPED
        ).then(() => (this.showStopBtnSpinner = false))
        .catch(() => (this.showStopBtnSpinner = false));
      },

      onSendButtonClicked() {
        this.showSendBtnSpinner = true;

        socketConnector.send(
          SocketMessages.SEND,
          this.prepareInternalCode(),
          SocketMessages.READY
        ).then(() => (this.showSendBtnSpinner = false))
        .catch(() => (this.showSendBtnSpinner = false));
      },

      onSaveButtonClicked() {
        this.showSaveBtnSpinner = true;

        /**
         * Project files in a zip containing
         * Readme.txt -> description
         * YYYY-MM-DD - Cody_pp.xml -> Codypp project file
         * arduino_sketch/
         *    arduino_sketch.ino
         *    ft_ESP32_IOobjects.h
         *    ft_ESP32_IOobjects.cpp
        **/

        /* including jszip for creating a zip file */
        /*  */
        var JSZip = require("jszip");
        var JSZipUtils = require("jszip-utils");

        var zip = new JSZip();

        /* add a Readme.txt file to the zip containing a description how to use the files */
        zip.file("Readme.txt", readme);

        /* add a *.xml file to the zip containing the codypp project */
        const xml1 = Blockly.Xml.workspaceToDom(this.blocklyWorkspace);
        const xml_text = Blockly.Xml.domToPrettyText(xml1);

        zip.file("codypp.xml", xml_text, { type: 'application/xml' });

        /* add a folder images/ */
        var arduino = zip.folder("arduino_sketch");

        /* add ft_ESP32_IOobjects.h library content */
        arduino.file("ft_ESP32_IOobjects.h", ft32_h);

        /* add ft_ESP32_IOobjects.cpp library content */
        arduino.file("ft_ESP32_IOobjects.cpp", ft32_cpp);

        /* get the generated c++ code from the code preview component */
        this.code = Blockly.ArduinoCpp.workspaceToCode(this.blocklyWorkspace)

        /* store the img from canvas into the created folder images/ */
        arduino.file("arduino_sketch.ino", this.code);

        /*  */
        zip.generateAsync({type:"blob"}).then((content) => {
            /* filename generation: prefix + filename => YYYY-MM-DD - FLENAME.zip */
            let prefix = (new Date()).getFullYear() + "-"
                          + ( (new Date()).getMonth() + 1) + "-" + (new Date()).getDate() + " - ";
            /* using FileSaver.js to save the zip file to the user */
            saveAs(content, prefix + "Project.zip");
            this.showSaveBtnSpinner = false;
        }).catch(() => {
            console.error("zip file couldn't be created. Internal error!");
            this.showSaveBtnSpinner = false;
        });
      },

      onLoadButtonClicked() {
        if (this.$refs.fileInput) {
          // trigger input field event
          this.$refs.fileInput.click();
        } else {
          console.warn('File input missing');
        }
      },

      onSettingsButtonClicked() {
        this.openConfigurationPage();
      },


      openConfigurationPage() {
        this.showSettingsBtnSpinner = true;

        window.open('/#/config', '_blank');

        this.showSettingsBtnSpinner = false;
      },

      onSocketClose() {
        this.showConnectBtnSpinner = true;

        this.webSocketReady = false;
        this.isRunning = false;
        this.isReady = false;

        this.showPlayBtnSpinner = false;
        this.showStopBtnSpinner = false;
        this.showSendBtnSpinner = false;
        this.showSaveBtnSpinner = false;
        this.showLoadBtnSpinner = false;

        this.showConnectBtnSpinner = false;
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

      onSocketOpen() {
        this.webSocketReady = true;
      },

      onSocketMessage(message) {
        //console.warn(message);
        console.log(`Received message: ${message}`);
        switch (message) {
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
      RoundButton,
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
    position: relative;

    &.visible {
      width: 40%;
    }

    &.invisible {
      .preview-container {
          display: none;
      }
    }

    .preview-container {
      .code-container {
        height: calc(100vh - #{$headerHeight});
        overflow-y: scroll;

        .scrollable {
          padding: 60px 20px;
          //max-height: auto;
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

      .hljs {
        background: transparent;
      }
    }

    .buttons {
      position: absolute;
      bottom: 20px;
      right: 32px;
      display: flex;
      flex-direction: row-reverse;
      transition: ease-in 0.2s;

      &.right-offset {
        bottom: 31px;
        right: 100px;
        transition: ease-out 0.2s;

        @media (max-width: 1350px) {
          bottom: 36px;
        }
      }

      @media (max-width: 1350px) {
        flex-direction: column;
      }

      .round-button {
        margin-left: 20px;

        @media (max-width: 1350px) {
          margin-top: 10px;
        }
      }

      .save-button {  }

      .load-button {  }

      .play-button {  }

      .stop-button {  }

      .send-button {  }
    }

  }
</style>
