<template>
  <div class="ft-connector">
    <form @submit.prevent="onConnectButtonClicked">
      <div class="input-fields">
        <InputField name="ip"
          type="text"
          title="FT32 IP Address:"
          :placeholder="placeholderIpAddress"
          v-model="value"
          :errorMessage="errorMessage" />
      </div>
      <div class="connect-button">
        <RoundButton  :icon="connectButtonIcon"
                      :enabled="!webSocketConnecting"
                      :showSpinner="showConnectBtnSpinner"
                      size="md" />
      </div>
    </form>
  </div>
</template>

<script>
import InputField from '../codypp-config/InputField'
import RoundButton from './RoundButton';
import socketConnector from '../../socketConnector';
import { validateIp, isEmpty } from '../../utils/validationUtils'


export default {
  name: 'FTConnector',

  data() {
    return {
        value: !validateIp(location.hostname) ? "192.168.4.1" : location.hostname,
        errorMessage: "",
        webSocketReady: false,
        webSocketConnecting: false,
        showConnectBtnSpinner: false,
        showConfigPageBtnSpinner: false,
        placeholderIpAddress: __DEFAULT_IP__,
        connectionTryCounter: 0,
        maxConnectionTries: 5,
    }
  },

  mounted() {
    socketConnector.onClose(this.onSocketClose);
    window.addEventListener("load", this.connect());
  },

  computed: {
    connectButtonIcon() {
      return this.webSocketReady ? 'disconnect' : 'connect';
    }
  },

  methods: {
    onSocketClose() {
        if( this.connectionTryCounter < this.maxConnectionTries && this.webSocketReady ) {
            console.error("Websocket connection lost! Reconnecting ...");
            this.webSocketReady = false;
            this.connect();
        } else {
            console.error("Websocket connection closed!");
            console.error(this.webSocketReady);
            this.webSocketReady = false;
        }
    },

    onConnectButtonClicked() {
      this.connectionTryCounter = 0;
      this.connect();
    },

    reconnect() {

    },

    connect() {
      console.log("Opening websocket connection ...");

      //reset error messages
      this.errorMessage = "";

      if( !this.webSocketReady ) {
        /* button state: connect to ws */
        if( !validateIp(this.value) ) {
          //IP adress is not valid
          this.errorMessage = "Invalid IP address!";
          this.webSocketConnecting = false;
        } else {
          if( this.webSocketConnecting != true ) {
            this.webSocketConnecting = true;
            console.log('Connect to websocket ...');
            this.openWebsocketConnection();
          } else {
            console.log('Connection process still running!');
          }
        }
      } else {
          /* button state: disonnect from ws */
          this.webSocketReady = false;
          this.webSocketConnecting = false;
          socketConnector.close();
      }
    },

    openWebsocketConnection() {
      this.showConnectBtnSpinner = true;

      socketConnector.connect(this.value).then(() => {
        this.webSocketReady = true;
        this.showConnectBtnSpinner = false;
        this.webSocketConnecting = false;
        this.connectionTryCounter = 0;
      }).catch(() => {
        this.showConnectBtnSpinner = false;
        this.webSocketReady = false;
        this.webSocketConnecting = false;

        this.connectionTryCounter+=1;

        if( this.connectionTryCounter >= this.maxConnectionTries ) {
            console.error("max connection tries to client reached!");
            this.errorMessage = `Not reacheable!`;
        } else {
            console.log("Not reachable! Try to reconnect ... " + this.connectionTryCounter);
            this.connect();
        }
      });
    },
  },

  components: {
    RoundButton,
    InputField
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

  .ft-connector {
    form {
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/ .input-field input {
        background: none;
        width: 110px;
        text-align: center;
      }
    }

    .connect-button {
      position: relative;
      left: 7px;

      /deep/ .icon {
        width: auto;
        height: 45%;
      }

      .round-button {
        background-color: rgba($colorMediumGrey, .2);
        box-shadow: 1px 1px 8px $colorDarkestGrey;

        &:hover {
          border: 0;
          background-color: rgba($colorGreen, 0.8);
        }
      }
    }
  }
</style>
