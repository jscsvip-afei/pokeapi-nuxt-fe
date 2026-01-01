<template>
  <!-- 主题切换按钮 -->
  <div tabindex="0" role="button" class="btn btn-ghost btn-sm gap-1 px-2 font-normal h-8 min-h-8 w-full">
    <span class="text-base leading-none">🎨</span>
    <span class="hidden sm:inline capitalize leading-none">{{ theme }}</span>
    <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
  
  <!-- 主题列表 -->
  <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow-lg bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto flex-nowrap">
    <li class="menu-title">
      <span>{{ t.theme.title }}</span>
    </li>
    <li v-for="th in THEMES" :key="th">
      <button 
        class="capitalize"
        :class="{ 'active': theme === th }"
        @click="setTheme(th)"
      >
        <span class="w-4 h-4 rounded" :data-theme="th" style="background: linear-gradient(135deg, oklch(var(--p)) 50%, oklch(var(--s)) 50%);"></span>
        {{ th }}
        <span v-if="theme === th" class="ml-auto">✓</span>
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const { theme, t, THEMES, setTheme } = useSettings()
</script>
