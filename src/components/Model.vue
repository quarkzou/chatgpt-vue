<script setup lang="ts">
import {ref, defineEmits} from 'vue';

const emit = defineEmits<{
  (e: 'update:selectedModel', model: string): void;
}>();

const selected_model = ref('gpt-4o')
const model_list = ['gpt-4o', 'o1-preview', 'gpt-4.5-preview']
const onRadioChange = (model: string) => {
  selected_model.value = model
  emit('update:selectedModel', model);
}
</script>

<template>
  <div class="radio-group" role="radiogroup">
    <label
        v-for="model in model_list"
        :key="model"
        class="radio-button"
        :class="{ checked: model == selected_model }"
    >
      <input
          type="radio"
          :value="model"
          @click="onRadioChange(model)"
      >
      {{ model }}
    </label>
  </div>
</template>

<style scoped>
.radio-group {
  display: inline-flex;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.radio-button {
  margin: 0;
  padding: 10px 16px;
  border: none;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.radio-button input {
  display: none;
}

.radio-button.checked {
  background-color: #1890ff;
  color: #fff;
}
</style>