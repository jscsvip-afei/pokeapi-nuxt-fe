<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <div class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">🔴 宝可梦图鉴</a>
      </div>
      <div class="flex-none gap-2">
        <div class="form-control">
          <input 
            type="text" 
            placeholder="搜索宝可梦..." 
            class="input input-bordered w-24 md:w-auto" 
            v-model="searchText"
            @input="onSearchChange"
          />
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 标题区 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-2">宝可梦列表</h1>
        <p class="text-base-content/70">探索神奇的宝可梦世界</p>
        <div class="badge badge-secondary mt-2">共 {{ filteredPokemons.length }} 只宝可梦</div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- 宝可梦卡片网格 -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div 
          v-for="pokemon in filteredPokemons" 
          :key="pokemon.url"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
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
              <button class="btn btn-primary btn-xs">详情</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredPokemons.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">😢</div>
        <p class="text-xl text-base-content/70">没有找到匹配的宝可梦</p>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <p>数据来源于 <a href="https://pokeapi.co/" class="link link-primary" target="_blank">PokéAPI</a></p>
      </aside>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 状态
const pokemons = ref([])
const filteredPokemons = ref([])
const searchText = ref('')
const loading = ref(true)

// 获取宝可梦数据
const fetchPokemons = async () => {
  try {
    loading.value = true
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
    const data = await response.json()
    
    // 为每个宝可梦添加 id
    const pokemonsWithId = data.results.map((pokemon, index) => ({
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

// 搜索过滤
const onSearchChange = () => {
  const searchValue = searchText.value.toLowerCase()
  filteredPokemons.value = pokemons.value.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchValue)
  )
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPokemons()
})
</script>