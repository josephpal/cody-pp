<template>
  <div class="inputFieldContainer">
    <div class="inputFields">
      <InputField name="ip"
                  type="text"
                  title="IP address:"
                  :placeholder="placeholderIpAddress"
                  v-model="ip" />
      <InputField name="ssid"
                  type="text"
                  title="SSID:"
                  v-model="ssid" />
      <InputField name="password"
                  type="password"
                  title="Password:"
                  v-model="password" />
      <InputField name="passwordConfirmed"
                  type="password"
                  title="Re-enter password:"
                  v-model="passwordConfirmed" />
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
      ip: "",
      ssid: "",
      password: "",
      passwordConfirmed: "",
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

      if( ( !validateIp(this.ip) || isEmpty(this.ip) )
          || isEmpty(this.ssid)
          || (isEmpty(this.password) || isEmpty(this.passwordConfirmed) )
          || ( this.password != this.passwordConfirmed ) ) {
        console.log("Validation failed.");      
      }

      this.showSendDataBtnSpinner = true;
      setTimeout(() => {
        console.log("Sending data...");
        this.showSendDataBtnSpinner = false; }, 1000);
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
    margin: 0 auto;
  }
</style>
