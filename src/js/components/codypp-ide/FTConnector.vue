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
        this.webSocketReady = false;
    },

    onConnectButtonClicked() {
      this.connect();
    },

    connect() {
      console.log("Opening websocket connection ...");

      //reset error messages
      this.errorMessage = "";

      if( !this.webSocketReady ) {
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
          socketConnector.close();
          this.webSocketConnecting = false;
      }
    },

    openWebsocketConnection() {
      this.showConnectBtnSpinner = true;

      socketConnector.connect(this.value).then(() => {
        this.webSocketReady = true;
        this.showConnectBtnSpinner = false;
        this.webSocketConnecting = false;
      }).catch(() => {
        this.showConnectBtnSpinner = false;
        this.webSocketReady = false;
        this.errorMessage = `Not reacheable!`;
        this.webSocketConnecting = false;
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
          background-color: $colorRed;
        }
      }
    }
  }
</style>
