<template>
  <div class="inputFieldContainer">
    <div class="inputFields">
      <InputField type="text" title="IP address:" placeholder="192.168.4.1"/>
      <InputField type="text" title="SSID:"/>
      <InputField type="password" title="Password:"/>
      <InputField type="password" title="Re-enter password:"/>
      <Button />
    </div>
  </div>
</template>

<script>
import InputField from './InputField'
import Button from './button'

export default {
  name: 'InputFieldContainer',

  components: {
    InputField,
    Button
  },
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
</style>
