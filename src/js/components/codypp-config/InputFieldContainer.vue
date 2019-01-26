<template>
  <div class="inputFieldContainer">
    <div class="inputFields">
      <InputField name="ip"
                  type="text"
                  title="IP address:"
                  :placeholder="placeholderIpAddress"
                  v-model="ip.value"
                  :errorMessage="ip.errorMessage" />
      <InputField name="ssid"
                  type="text"
                  title="SSID:"
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

  methods: {
    onSendDataButtonClicked() {
      //data validation

      if( ( !validateIp(this.ip.value) || isEmpty(this.ip.value) )
          || isEmpty(this.ssid)
          || (isEmpty(this.password) || isEmpty(this.passwordConfirmed) )
          || ( this.password != this.passwordConfirmed ) ) {
        console.log("Validation failed.");
        this.ip.errorMessage = "PENIS";
      }

      this.showSendDataBtnSpinner = true;
      setTimeout(() => {
        console.log("Sending data...");
        this.showSendDataBtnSpinner = false;
        this.ip.errorMessage = ""; }, 2000);
      }
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
