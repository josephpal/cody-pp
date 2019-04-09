<template>
  <header>
    <div class="inner">
      <img class="logo" src="../../assets/svg/logo.svg" />

      <FTConnector v-if="showConnector" />
    </div>


    <p>&#169; Copyright {{(new Date()).getFullYear()}}, T. Tränkel, F.J. Pal</p>
  </header>
</template>

<script>
import FTConnector from './codypp-ide/FTConnector';

export default {
  name: 'Header',

  computed: {
    showConnector() {
      return this.$route.name === 'codypp';
    }
  },

  components: {
    FTConnector
  }
};
</script>

<style lang="scss">
  @import '../../scss/variables/colors';

  header {
    height: $headerHeight;
    width: 100%;
    background-color: $colorDarkBlue;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .inner {
      display: flex;
      align-items: center;
      height: 100%;

      float: left;
      position: relative;
      width: 60%;

      .logo {
        height: 70%;
        width: auto;
      }

      .ft-connector {
        position: absolute;
        right: 38px;
      }
    }
  }
</style>
