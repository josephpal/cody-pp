<template>
  <header>
    <img class="logo" src="../../assets/svg/logo.svg" />
    <p>&#169; Copyright {{(new Date()).getFullYear()}}, T. Tränkel, F.J. Pal</p>
  </header>
</template>

<script>
export default {
  name: 'Header',
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

    .logo {
      height: 70%;
      width: auto;
    }
  }
</style>
