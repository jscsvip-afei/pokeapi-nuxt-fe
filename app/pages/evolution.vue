<template>
  <div class="min-h-screen bg-base-200">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-8">
      <!-- Hero 区域 -->
      <div class="hero bg-base-100 rounded-box mb-8 shadow-lg">
        <div class="hero-content text-center py-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              进化链浏览器
            </h1>
            <p class="py-4 text-base-content/70 max-w-md mx-auto">
              探索宝可梦的进化关系，了解进化条件和分支
            </p>
            <div class="stats shadow">
              <div class="stat place-items-center">
                <div class="stat-title">进化链总数</div>
                <div class="stat-value text-primary">{{ total }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">已加载</div>
                <div class="stat-value text-secondary">{{ evolutionChains.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索框 -->
      <div class="mb-6 flex justify-center">
        <div class="join">
          <input 
            v-model="searchId"
            type="number"
            class="input input-bordered join-item w-48"
            placeholder="输入宝可梦ID..."
            min="1"
            @keyup.enter="searchByPokemonId"
          />
          <button 
            class="btn btn-primary join-item"
            :disabled="!searchId || searching"
            @click="searchByPokemonId"
          >
            <span v-if="searching" class="loading loading-spinner loading-sm"></span>
            <span v-else>查找进化链</span>
          </button>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResult" class="mb-8">
        <div class="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>搜索结果: #{{ searchId }} 的进化链</span>
          <button class="btn btn-sm btn-ghost" @click="searchResult = null">✕</button>
        </div>
        <EvolutionChainCard :chain="searchResult" />
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 6" :key="i" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="skeleton h-8 w-32 mb-4"></div>
            <div class="flex items-center justify-center gap-4 flex-wrap">
              <div v-for="j in 3" :key="j" class="flex flex-col items-center">
                <div class="skeleton w-24 h-24 rounded-full"></div>
                <div class="skeleton h-4 w-20 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 进化链列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EvolutionChainCard 
          v-for="chain in evolutionChains" 
          :key="chain.id" 
          :chain="chain"
        />
      </div>

      <!-- 无限滚动触发器 -->
      <div 
        ref="loadMoreTrigger"
        v-if="!loading && hasMore" 
        class="text-center py-8"
      >
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-sm text-base-content/60 mt-2">
          加载更多进化链... ({{ evolutionChains.length }} / {{ total }})
        </p>
      </div>

      <!-- 已加载全部 -->
      <div 
        v-if="!loading && !hasMore && evolutionChains.length > 0" 
        class="text-center py-8"
      >
        <p class="text-sm text-base-content/60">
          ✨ 已加载全部 {{ evolutionChains.length }} 条进化链
        </p>
      </div>
    </div>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { EvolutionChain } from '~/types/evolution'

const { fetchEvolutionChains, fetchEvolutionChain, fetchEvolutionChainBySpecies } = useEvolution()

// 状态
const evolutionChains = ref<EvolutionChain[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const total = ref(0)
const offset = ref(0)
const limit = 20

// 搜索
const searchId = ref<number | null>(null)
const searching = ref(false)
const searchResult = ref<EvolutionChain | null>(null)

// 无限滚动
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 是否还有更多
const hasMore = computed(() => evolutionChains.value.length < total.value)

// 初始化
const init = async () => {
  loading.value = true
  try {
    const { chains, total: totalCount } = await fetchEvolutionChains(limit, 0)
    total.value = totalCount
    offset.value = limit

    // 获取进化链详情
    const details = await Promise.all(
      chains.map(c => fetchEvolutionChain(c.id))
    )
    evolutionChains.value = details
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  
  loadingMore.value = true
  try {
    const { chains } = await fetchEvolutionChains(limit, offset.value)
    offset.value += limit

    // 获取进化链详情
    const details = await Promise.all(
      chains.map(c => fetchEvolutionChain(c.id))
    )
    evolutionChains.value = [...evolutionChains.value, ...details]
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 搜索宝可梦进化链
const searchByPokemonId = async () => {
  if (!searchId.value) return
  
  searching.value = true
  searchResult.value = null
  
  try {
    const chain = await fetchEvolutionChainBySpecies(searchId.value)
    searchResult.value = chain
    if (!chain) {
      alert('未找到该宝可梦的进化链')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    alert('搜索失败，请检查ID是否正确')
  } finally {
    searching.value = false
  }
}

// 组件挂载
onMounted(() => {
  init()
  
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && !loadingMore.value && !loading.value) {
        loadMore()
      }
    },
    { rootMargin: '100px', threshold: 0.1 }
  )
})

// 监听触发器
watch(loadMoreTrigger, (newEl, oldEl) => {
  if (oldEl && observer) observer.unobserve(oldEl)
  if (newEl && observer) observer.observe(newEl)
})

// 清理
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
