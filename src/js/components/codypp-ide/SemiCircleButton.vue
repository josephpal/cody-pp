<template>
  <button class="semicircle-button" :class="!enabled ? 'disabled' : ''" @click="onClicked">
    <div class="arrow" />
  </button>
</template>

<script>
  export default {
    name: 'SemiCircleButton',

    props: {
      enabled: {
        type: Boolean,
        default: true,
      },
      icon: {
        type: String,
        required: true
      }
    },

    computed: {
      iconPath() {
        return `${sprites}#${this.icon}`;
      }
    },

    methods: {
      onClicked() {
        if (this.enabled) {
          this.$emit('click');
        }
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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 64px;
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
    border: 0;
    outline: 0;
    color: #fff;
    cursor: pointer;
    box-shadow: 2px 2px 10px $colorDarkestGrey;
    background-color: rgba($colorMediumGrey, .2);
    transition: background-color .3s;

    &:hover {
      border: 0;
      background-color: rgba($colorBlocklyGreyActive, 0.65);
    }

    &.disabled {
      background-color: rgba($colorMediumGrey, .4);
      color: hsla(0, 0, 0, .4);
      cursor: default;
    }

    .arrow {
      height: 10px;
      width: 10px;
      left: 3px;
      position: relative;
      transition: transform .2s;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0px;
        right: 0;
        margin: auto;
        width: 10px;
        height: 10px;
        border: 2px solid $transparentWhite;
        border-left: 0;
        border-top: 0;
        transform: rotate(135deg);
      }
    }
  }
</style>
