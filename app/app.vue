<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <Navbar>
      <SearchInput 
        v-model="searchText" 
        placeholder="搜索宝可梦..."
      />
    </Navbar>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 标题区 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-2">宝可梦列表</h1>
        <p class="text-base-content/70">探索神奇的宝可梦世界</p>
        <div class="badge badge-secondary mt-2">共 {{ filteredPokemons.length }} 只宝可梦</div>
      </div>

      <!-- 宝可梦列表 -->
      <PokemonList 
        :pokemons="filteredPokemons" 
        :loading="loading"
        @detail="handleDetail"
      />
    </div>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Pokemon } from './components/PokemonCard.vue'

// 状态
const pokemons = ref<Pokemon[]>([])
const filteredPokemons = ref<Pokemon[]>([])
const searchText = ref('')
const loading = ref(true)

// 获取宝可梦数据
const fetchPokemons = async () => {
  try {
    loading.value = true
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
    const data = await response.json()
    
    // 为每个宝可梦添加 id
    const pokemonsWithId = data.results.map((pokemon: any, index: number) => ({
      ...pokemon,
      id: index + 1
    }))
    
    pokemons.value = pokemonsWithId
    filteredPokemons.value = pokemonsWithId
  } catch (error) {
    console.error('获取宝可梦数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听搜索文本变化进行过滤
watch(searchText, (newValue) => {
  const searchValue = newValue.toLowerCase()
  filteredPokemons.value = pokemons.value.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchValue)
  )
})

// 处理详情点击
const handleDetail = (pokemon: Pokemon) => {
  console.log('查看详情:', pokemon)
  // 后续可以跳转到详情页或打开模态框
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPokemons()
})
</script>