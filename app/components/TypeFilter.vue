<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <!-- 全部按钮 -->
    <button 
      class="btn btn-sm"
      :class="selectedType === '' ? 'btn-primary' : 'btn-outline'"
      @click="$emit('select', '')"
    >
      全部
    </button>
    
    <!-- 收藏按钮 -->
    <button 
      class="btn btn-sm gap-1"
      :class="showFavorites ? 'btn-error' : 'btn-outline'"
      @click="$emit('toggleFavorites')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      收藏
      <span v-if="(favoritesCount ?? 0) > 0" class="badge badge-sm">{{ favoritesCount }}</span>
    </button>

    <div class="divider divider-horizontal mx-0"></div>

    <!-- 类型按钮 -->
    <button 
      v-for="type in types" 
      :key="type.name"
      class="btn btn-sm text-white border-0"
      :class="selectedType === type.name ? 'ring-2 ring-offset-2' : 'opacity-80 hover:opacity-100'"
      :style="{ backgroundColor: TYPE_COLORS[type.name] || '#999' }"
      @click="$emit('select', type.name)"
    >
      {{ TYPE_NAMES_ZH[type.name] || type.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { TYPE_COLORS, TYPE_NAMES_ZH } from '~/types/pokemon'

defineProps<{
  types: Array<{ name: string; url: string }>
  selectedType: string
  showFavorites?: boolean
  favoritesCount?: number
}>()

defineEmits<{
  select: [type: string]
  toggleFavorites: []
}>()
</script>
