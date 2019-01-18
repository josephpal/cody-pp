<template>
  <div class="drop-down" :class="{ 'opened': isOpened }" @click.stop="isOpened = !isOpened">
    <div class="current">
      <span>{{ options.find(option => selected === option.id).name }}</span>
      <div class="arrow"></div>
    </div>
    <div class="options" v-show="isOpened">
      <ul>
        <li v-for="option in options" @click="() => onClicked(option.id)">
          {{ option.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DropDown",

    data() {
      return {
        isOpened: false
      };
    },

    created() {
      window.addEventListener('click', this.onWindowClick);
    },

    beforeDestroy() {
      window.removeEventListener('click', this.onWindowClick);
    },

    props: {
      options: {
        type: Array,
        required: true
      },
      selected: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onClicked(id) {
        this.$emit('change', id);
      },
      onWindowClick() {
        this.isOpened = false;
      }
    }
  };
</script>

<style lang="scss">
  @import '../../../scss/variables/colors';

  $transparentWhite: rgba($colorWhite, .4);

  .drop-down {
    position: relative;
    cursor: pointer;
    display: inline-block;
    min-width: 160px;
    font-size: 1em;
    background-color: $colorDarkestBlue;

    &.opened {
      .arrow {
        transform: rotate(-180deg);
      }
    }

    .current {
      padding: 7px 10px 7px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid $transparentWhite;

      .arrow {
        height: 16px;
        width: 16px;
        position: relative;
        transition: transform .2s;

        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 8px;
          height: 8px;
          border: 2px solid $transparentWhite;
          border-left: 0;
          border-top: 0;
          transform: rotate(45deg);
        }
      }
    }

    .options {
      position: absolute;
      width: 100%;
      border: 1px solid $transparentWhite;
      border-top: 0;
      background-color: $colorDarkestBlue;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          padding: 7px 10px;
          transition: color .2s, background-color .2s;

          &:hover {
            color: $colorDarkestBlue;
            background-color: $colorWhite;
          }
        }
      }
    }
  }
</style>
