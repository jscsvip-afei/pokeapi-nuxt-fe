<template>
  <div>
    <!-- 加载状态 - 骨架屏 -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div 
        v-for="n in 10" 
        :key="n"
        class="card bg-base-100 shadow-xl"
      >
        <figure class="px-4 pt-4 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div class="skeleton w-24 h-24 rounded-full"></div>
        </figure>
        <div class="card-body items-center text-center p-4">
          <div class="skeleton h-4 w-12"></div>
          <div class="skeleton h-4 w-20 mt-2"></div>
          <div class="skeleton h-6 w-16 mt-2"></div>
        </div>
      </div>
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
