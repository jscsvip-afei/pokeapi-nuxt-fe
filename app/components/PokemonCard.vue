<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <figure class="px-4 pt-4 bg-gradient-to-br from-primary/10 to-secondary/10">
      <img 
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`" 
        :alt="pokemon.name"
        class="w-24 h-24 object-contain"
      />
    </figure>
    <div class="card-body items-center text-center p-4">
      <span class="badge badge-outline badge-sm">#{{ pokemon.id }}</span>
      <h2 class="card-title text-sm capitalize">{{ pokemon.name }}</h2>
      <div class="card-actions">
        <button class="btn btn-primary btn-xs" @click="$emit('detail', pokemon)">详情</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Pokemon {
  id: number
  name: string
  url: string
}

defineProps<{
  pokemon: Pokemon
}>()

defineEmits<{
  detail: [pokemon: Pokemon]
}>()
</script>
