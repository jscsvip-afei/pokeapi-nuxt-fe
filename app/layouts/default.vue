<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const { initSettings } = useSettings()

onMounted(() => {
  initSettings()
})
</script>
