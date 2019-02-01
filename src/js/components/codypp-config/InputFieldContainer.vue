<template>
  <div class="inputFieldContainer">
    <div class="inputFields">
      <InputField name="ip"
                  type="text"
                  title="FT32 IP address:"
                  :placeholder="placeholderIpAddress"
                  v-model="ip.value"
                  :errorMessage="ip.errorMessage" />
      <InputField name="ssid"
                  type="text"
                  title="Network name:"
                  v-model="ssid.value"
                  :errorMessage="ssid.errorMessage" />
      <InputField name="password"
                  type="password"
                  title="Password:"
                  v-model="password.value"
                  :errorMessage="password.errorMessage" />
      <InputField name="passwordConfirmed"
                  type="password"
                  title="Re-enter password:"
                  v-model="passwordConfirmed.value"
                  :errorMessage="passwordConfirmed.errorMessage" />
      <div class="button">
        <RoundButton  :icon="icons.ArrowIcon"
                      :enabled="true"
                      @click="onSendDataButtonClicked"
                      :showSpinner="showSendDataBtnSpinner" />
      </div>
    </div>
  </div>
</template>

<script>
/* global __DEAFULT_IP__ */

import InputField from './InputField'
import RoundButton from '../codypp-ide/RoundButton'
import ArrowIcon from '../../../assets/svg/arrow.svg';
import { validateIp, isEmpty } from '../../utils/validationUtils'

import { asyncWebSocketRequest } from '../../utils/socketUtils';
import SocketMessages from "../../enum/SocketMessageTypes";

export default {
  name: 'InputFieldContainer',

  data() {
    return {
      ip: {
        value: "",
        errorMessage: "",
      },
      ssid: {
        value: "",
        errorMessage: "",
      },
      password: {
        value: "",
        errorMessage: "",
      },
      passwordConfirmed: {
        value: "",
        errorMessage: "",
      },
      placeholderIpAddress: __DEFAULT_IP__,

      //websocket status
      webSocketReady: false,

      //spinner state
      showSendDataBtnSpinner: false
    };
  },

  computed: {
    icons() {
      return {
        ArrowIcon
      };
    },
  },

  beforeDestroy() {
      this.socket.removeEventListener('message', this.onSocketMessage);
  },

  methods: {
    onSendDataButtonClicked() {
      //reset error messages
      this.ip.errorMessage = "";
      this.ssid.errorMessage = "";
      this.password.errorMessage = "";
      this.passwordConfirmed.errorMessage = "";

      //data validation

      if( !validateIp(this.ip.value) ) {
        //IP adress is not valid
        this.ip.errorMessage = "Invalid IP address!";
      }

      if( isEmpty(this.ip.value) ) {
        //IP adress field empty
        this.ip.errorMessage = "IP address field is required!";
      }

      if( isEmpty(this.ssid.value) ) {
        //ssid field empty
        this.ssid.errorMessage = "SSID field is required!";
      }

      if( isEmpty(this.password.value) ) {
        //password field empty
        this.password.errorMessage = "Password field is required!";
      }

      if( isEmpty(this.passwordConfirmed.value) ) {
        //confirmed password field empty
        this.passwordConfirmed.errorMessage = "Password field is required!";
      }

      if( this.passwordConfirmed.value !== this.password.value ) {
        //confirmed password is equal to password?
        this.passwordConfirmed.errorMessage = "Passwords do not match!";
      }

      //connect to ws on given ip address
      if( validateIp(this.ip.value)
        && !isEmpty(this.ssid.value)
        && !isEmpty(this.password.value)
        && !isEmpty(this.passwordConfirmed.value)
        && (this.passwordConfirmed.value == this.password.value) ) {

          this.openWebsocketConnection(this.ip.value);
      }
    },

    onSocketMessage(message) {
      console.warn(message);
      console.log(`Received message ${message.data}`);
      switch (message.data) {
          case SocketMessages.RUNNING:

              break;
          case SocketMessages.STOPPED:
;
              break;
          case SocketMessages.PAUSED:

              break;
          case SocketMessages.READY:

              break;
          case SocketMessages.ERROR:
              console.error('Server error');
              break;
          default:
              console.warn('Unknown socket message');
              break;
      }
    },

    openWebsocketConnection(ip) {
      this.showSendDataBtnSpinner = true;

      this.socket = new WebSocket(`ws://${ip}:90`);
      this.socket.addEventListener('open', () => {
        this.webSocketReady = true;
        this.showSendDataBtnSpinner = false;
        this.sendConfig;
      });
      this.socket.addEventListener('message', this.onSocketMessage);
      this.socket.addEventListener('error', () => {
        this.showSendDataBtnSpinner = false;
        this.ip.errorMessage = `${this.ip.value} not reacheable!`;
      });
    },

    sendConfig() {
      this.showSendDataBtnSpinner = true;

      return asyncWebSocketRequest(
        this.socket,
        SocketMessages.SEND,
        'TEST',
        SocketMessages.READY,
      ).then(() => (this.showSendDataBtnSpinner = false)).catch(() => (this.showSendDataBtnSpinner = false));
    },
  },

  components: {
    InputField,
    RoundButton
  }
};
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';

  .inputFieldContainer {
    position: absolute;
    top: 100px;
    display: flex;
    justify-content: center;
  }

  .inputFields {
    display: flex;
    flex-direction: column;
    width: 320px;
  }

  .button {
    align: center;
    padding-top: 20px;
    margin: 0 auto;
  }
</style>
