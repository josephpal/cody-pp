<template>
  <div class="input-field">
    <p class="title">{{title}}</p>
    <input  :type="type"
            :name="name"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.value)"
            :value="value" >
  </div>
</template>

<script>
export default {
  name: 'InputField',

  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String
    },
    value: {
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
