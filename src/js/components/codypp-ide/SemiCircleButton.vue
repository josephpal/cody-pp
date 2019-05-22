<template>
  <button class="semicircle-button"
          :class="{ 'isHided': isHided }"
          @click.stop="isHided = !isHided"
          @click="onClicked">

    <div class="arrow" />
  </button>
  <!--<div class="origin"></div>-->
</template>

<script>
  export default {
    name: 'SemiCircleButton',

    data() {
      return {
        isHided: false
      };
    },

    props: { },

    methods: {
      onClicked() {
        this.$emit('click');
      }
    },

    components: { },
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

  $transparentWhite: rgba($colorWhite, .4);

  .semicircle-button {
    width: 32px;
    height: 64px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
    border: 0;

    outline: 0;
    cursor: pointer;
    box-shadow: 2px 2px 10px $colorDarkestGrey;
    background-color: rgba($colorDarkBlue, .2);

    &.isHided {
      .arrow {
        left: 4px;
        transform:  rotate(-180deg);
      }
    }

    &:hover {
      border: 0;
      background-color: rgba($colorDarkBlue, 0.65);
    }

    .arrow {
      position: relative;
      height: 12px;
      width: 12px;

      transform-origin: center center;
      transition: transform .3s;

      &:before,
      &:after {
        position: absolute;
        width: 100%;
        height: 100%;
        display: block;
        top: 0;
        left: 0px;

        content: '';
        box-sizing: border-box;
        border: 2px solid $transparentWhite;
        border-left: 0;
        border-top: 0;

        transform:  rotate(-45deg);
      }
    }

    /*.arrow {
      position: relative;
      top: 0;
      left: 0;
      height: 16px;
      width: 16px;
      border: 2px solid $transparentWhite;
      background-color: yellow;

      transition: transform .5s;

      &:before,
      &:after {
        position: absolute;
        //display: block;
        content: '';
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;

        background-color: red;
        border-left: 0;
        border-top: 0;

        transform-origin: 50% 50%;
        transform: rotate(135deg);

      }
    }*/
  }
</style>
