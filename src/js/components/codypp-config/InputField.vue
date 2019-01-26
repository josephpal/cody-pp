<template>
  <div class="input-field-box">
    <p class="title">{{title}}</p>
    <div class="input-field">
      <input  :type="type"
              :name="name"
              :placeholder="placeholder"
              @input="$emit('input', $event.target.value)"
              :value="value" >
      <div class="error-message">
        <span :class="{ 'error-message-invisible': !errorMessage.length }">{{errorMessage}}</span>
      </div>
    </div>
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
    },
    errorMessage: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
.input-field-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-field {
  position: relative;
}

.error-message {
  position: absolute;
  top: 100%;
  font-size: 0.8em;
  color: red;
}

.error-message-invisible {
  opacity: 0;
}

input {
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid gray;
}
</style>
