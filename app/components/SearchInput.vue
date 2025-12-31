<template>
  <div class="form-control">
    <input 
      type="text" 
      :placeholder="placeholder"
      class="input input-bordered w-24 md:w-auto" 
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
