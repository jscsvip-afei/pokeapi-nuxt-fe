<template>
  <button 
    class="btn btn-ghost btn-sm gap-1"
    @click="toggleLanguage"
  >
    <span class="text-lg">🌐</span>
    <span class="font-medium">{{ language === 'zh' ? '中' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const { language, toggleLanguage } = useSettings()
</script>
