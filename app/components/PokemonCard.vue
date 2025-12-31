<template>
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
    @click="$emit('click', pokemon)"
  >
    <!-- 收藏按钮 -->
    <button 
      class="btn btn-circle btn-sm btn-ghost absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      @click.stop="$emit('toggleFavorite', pokemon.id)"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-5 w-5" 
        :fill="isFavorite ? 'currentColor' : 'none'"
        :class="isFavorite ? 'text-error' : 'text-base-content'"
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <figure class="px-4 pt-4 bg-gradient-to-br from-primary/10 to-secondary/10 relative">
      <!-- 闪光标志 -->
      <div v-if="detail?.is_legendary || detail?.is_mythical" class="absolute top-2 left-2">
        <span class="badge badge-warning badge-sm">✨</span>
      </div>
      <img 
        :src="getSpriteUrl(pokemon.id, 'artwork')" 
        :alt="pokemon.name"
        class="w-28 h-28 object-contain drop-shadow-lg"
        loading="lazy"
        @error="handleImageError"
      />
    </figure>
    
    <div class="card-body items-center text-center p-4">
      <span class="badge badge-outline badge-sm font-mono">#{{ String(pokemon.id).padStart(3, '0') }}</span>
      <h2 class="card-title text-sm capitalize">{{ pokemon.name }}</h2>
      
      <!-- 类型标签 -->
      <div v-if="types.length > 0" class="flex gap-1 flex-wrap justify-center">
        <span 
          v-for="type in types" 
          :key="type"
          class="badge badge-sm text-white"
          :style="{ backgroundColor: TYPE_COLORS[type] || '#999' }"
        >
          {{ TYPE_NAMES_ZH[type] || type }}
        </span>
      </div>
      
      <div class="card-actions mt-2">
        <button class="btn btn-primary btn-xs" @click.stop="$emit('detail', pokemon)">
          详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon, PokemonDetail } from '~/types/pokemon'
import { TYPE_COLORS, TYPE_NAMES_ZH } from '~/types/pokemon'

const props = defineProps<{
  pokemon: Pokemon
  isFavorite?: boolean
  types?: string[]
  detail?: { is_legendary?: boolean; is_mythical?: boolean }
}>()

defineEmits<{
  click: [pokemon: Pokemon]
  detail: [pokemon: Pokemon]
  toggleFavorite: [id: number]
}>()

const { getSpriteUrl } = usePokemon()

const types = computed(() => props.types || [])

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  // 回退到默认精灵图
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokemon.id}.png`
}
</script>
