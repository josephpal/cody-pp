<template>
  <header>
    <h1>Cody++</h1>
    <p>&#169; Copyright 2017, T. Tr&auml;nkel, F.J. Pal</p>
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
  }
</style>
