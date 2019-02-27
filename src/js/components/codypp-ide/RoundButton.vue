<template>
  <div class="round-button" :class="{ disabled: !enabled }" @click="onClicked">
    <Spinner v-if="showSpinner"/>
    <svg class="icon" v-else>
      <use :href="iconPath"></use>
    </svg>
  </div>
</template>

<script>
  import Spinner from './Spinner';
  import sprites from '../../../assets/svg/sprites.svg';

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
      },
        showSpinner: {
          type: Boolean,
          default: false,
        },
    },

    computed: {
      iconPath() {
        return `${sprites}#${this.icon}`;
      }
    },

    methods: {
      onClicked() {
        if (this.enabled && !this.showSpinner) {
          this.$emit('click');
        }
      }
    },

      components: {
          Spinner,
      },
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';
  @import '../../../scss/mixins/breakpoints';

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
      color: hsla(0, 0, 0, .4);
      cursor: default;
    }

    .icon {
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
