<template>
  <div class="input-field">
    <p class="title">{{title}}</p>
    <input :type="type" name="">
  </div>
</template>

<script>
export default {
  name: 'InputField',

  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.input-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
