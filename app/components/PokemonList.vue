<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- 宝可梦卡片网格 -->
    <div v-else-if="pokemons.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <PokemonCard 
        v-for="pokemon in pokemons" 
        :key="pokemon.url"
        :pokemon="pokemon"
        @detail="handleDetail"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">😢</div>
      <p class="text-xl text-base-content/70">没有找到匹配的宝可梦</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from './PokemonCard.vue'

defineProps<{
  pokemons: Pokemon[]
  loading: boolean
}>()

const emit = defineEmits<{
  detail: [pokemon: Pokemon]
}>()

const handleDetail = (pokemon: Pokemon) => {
  emit('detail', pokemon)
}
</script>
