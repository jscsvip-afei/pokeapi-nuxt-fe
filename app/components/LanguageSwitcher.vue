<template>
  <button 
    class="btn btn-ghost btn-sm gap-1 px-2 font-normal h-8 min-h-8"
    @click="toggleLanguage"
  >
    <span class="text-base leading-none">🌐</span>
    <span class="leading-none">{{ language === 'zh' ? '中' : 'EN' }}</span>
  </button>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const { language, toggleLanguage } = useSettings()
</script>
