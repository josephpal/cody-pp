<template>
  <div class="round-button" :class="{ disabled: !enabled }" @click="onClicked">
    <svg>
      <use :href="`${icon}#Layer_1`"></use>
    </svg>
  </div>
</template>

<script>
  export default {
    name: 'RoundButton',

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

    methods: {
      onClicked() {
        if (this.enabled) {
          this.$emit('click');
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../../scss/variables/colors';
  @import '../../scss/mixins/breakpoints';

  .round-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 100%;
    border: 0;
    cursor: pointer;
    box-shadow: 2px 2px 10px $colorDarkestGrey;
    background-color: rgba($colorRed, .8);
    transition: background-color .3s;

    @include respond-to(tablet) {
      width: 50px;
      height: 50px;
    }

    &:hover {
      border: 0;
      background-color: $colorRed;
    }

    &.disabled {
      background-color: rgba($colorMediumGrey, .4);
      color: $colorDarkestGrey;
      cursor: default;
    }

    svg {
      width: auto;
      height: 20px;
      fill: #fff;

      @include respond-to(tablet) {
        width: auto;
        height: 16px;
      }
    }
  }
</style>
