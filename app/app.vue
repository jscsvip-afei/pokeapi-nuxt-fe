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
      <!-- Hero 区域 -->
      <div class="hero bg-base-100 rounded-box mb-8 shadow-lg">
        <div class="hero-content text-center py-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              宝可梦图鉴
            </h1>
            <p class="py-4 text-base-content/70 max-w-md mx-auto">
              探索神奇的宝可梦世界，查看详细属性和能力
            </p>
            <div class="stats shadow">
              <div class="stat place-items-center">
                <div class="stat-title">总数</div>
                <div class="stat-value text-primary">{{ total }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">已加载</div>
                <div class="stat-value text-secondary">{{ allPokemons.length }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">收藏</div>
                <div class="stat-value text-error">{{ favoritesCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 类型筛选 -->
      <div class="mb-6 p-4 bg-base-100 rounded-box shadow">
        <TypeFilter 
          :types="types"
          :selected-type="selectedType"
          :show-favorites="showFavorites"
          :favorites-count="favoritesCount"
          @select="handleTypeSelect"
          @toggle-favorites="toggleShowFavorites"
        />
      </div>

      <!-- 搜索结果提示 -->
      <div v-if="searchText || selectedType || showFavorites" class="mb-4 flex items-center gap-2 flex-wrap">
        <span class="text-base-content/60">筛选结果:</span>
        <span v-if="searchText" class="badge badge-lg gap-1">
          搜索: {{ searchText }}
          <button class="btn btn-ghost btn-xs" @click="searchText = ''">✕</button>
        </span>
        <span v-if="selectedType" class="badge badge-lg gap-1" :style="{ backgroundColor: TYPE_COLORS[selectedType], color: 'white' }">
          类型: {{ TYPE_NAMES_ZH[selectedType] }}
          <button class="btn btn-ghost btn-xs text-white" @click="selectedType = ''">✕</button>
        </span>
        <span v-if="showFavorites" class="badge badge-lg badge-error gap-1">
          仅收藏
          <button class="btn btn-ghost btn-xs" @click="showFavorites = false">✕</button>
        </span>
        <span class="text-base-content/60 ml-auto">共 {{ displayPokemons.length }} 只</span>
      </div>

      <!-- 宝可梦列表 -->
      <PokemonList 
        :pokemons="displayPokemons" 
        :loading="loading"
        :pokemon-types="pokemonTypesMap"
        @click="handleCardClick"
        @detail="handleDetail"
        @toggle-favorite="handleToggleFavorite"
      />

      <!-- 无限滚动触发器 -->
      <div 
        ref="loadMoreTrigger"
        v-if="!loading && !selectedType && !showFavorites && hasMore" 
        class="text-center py-8"
      >
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-sm text-base-content/60 mt-2">
          滚动加载更多... ({{ allPokemons.length }} / {{ total }})
        </p>
      </div>

      <!-- 已加载全部 -->
      <div 
        v-if="!loading && !selectedType && !showFavorites && !hasMore && allPokemons.length > 0" 
        class="text-center py-8"
      >
        <p class="text-sm text-base-content/60">
          ✨ 已加载全部 {{ allPokemons.length }} 只宝可梦
        </p>
      </div>
    </div>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 详情模态框 -->
    <PokemonDetailModal 
      ref="detailModalRef"
      :pokemon="selectedPokemon"
      :is-favorite="selectedPokemon ? isFavorite(selectedPokemon.id) : false"
      @toggle-favorite="handleToggleFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import type { Pokemon, PokemonDetail } from '~/types/pokemon'
import { TYPE_COLORS, TYPE_NAMES_ZH } from '~/types/pokemon'

const { fetchPokemonList, fetchTypes, fetchPokemonsByType, fetchPokemonDetail } = usePokemon()
const { isFavorite, toggleFavorite, getFavorites } = useFavorites()

// 状态
const allPokemons = ref<Pokemon[]>([])
const typedPokemons = ref<Pokemon[]>([])
const types = ref<Array<{ name: string; url: string }>>([])
const searchText = ref('')
const selectedType = ref('')
const showFavorites = ref(false)
const loading = ref(true)
const loadingMore = ref(false)
const total = ref(0)
const offset = ref(0)
const limit = 50

// 详情模态框
const detailModalRef = ref<{ open: () => void; close: () => void } | null>(null)
const selectedPokemon = ref<Pokemon | null>(null)

// 无限滚动
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 宝可梦类型映射（缓存）
const pokemonTypesMap = ref<Record<number, string[]>>({})

// 计算收藏数量
const favoritesCount = computed(() => getFavorites().length)

// 是否还有更多数据
const hasMore = computed(() => allPokemons.value.length < total.value)

// 计算展示的宝可梦列表
const displayPokemons = computed(() => {
  let result: Pokemon[] = []

  // 收藏模式
  if (showFavorites.value) {
    const favoriteIds = getFavorites()
    result = allPokemons.value.filter(p => favoriteIds.includes(p.id))
  }
  // 类型筛选模式
  else if (selectedType.value) {
    result = typedPokemons.value
  }
  // 默认模式
  else {
    result = allPokemons.value
  }

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(search) ||
      String(p.id).includes(search)
    )
  }

  return result
})

// 初始化
const init = async () => {
  loading.value = true
  try {
    // 并行获取列表和类型
    const [listData, typesData] = await Promise.all([
      fetchPokemonList(limit, 0),
      fetchTypes()
    ])
    
    allPokemons.value = listData.pokemons
    total.value = listData.total
    offset.value = limit
    types.value = typesData

    // 批量获取前 20 只宝可梦的类型（用于显示）
    await fetchTypesForPokemons(listData.pokemons.slice(0, 20))
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取宝可梦类型信息
const fetchTypesForPokemons = async (pokemons: Pokemon[]) => {
  const promises = pokemons.map(async (p) => {
    if (!pokemonTypesMap.value[p.id]) {
      try {
        const detail = await fetchPokemonDetail(p.id)
        pokemonTypesMap.value[p.id] = detail.types.map(t => t.type.name)
      } catch (e) {
        // 忽略错误
      }
    }
  })
  await Promise.all(promises)
}

// 加载更多
const loadMore = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  try {
    const { pokemons } = await fetchPokemonList(limit, offset.value)
    allPokemons.value = [...allPokemons.value, ...pokemons]
    offset.value += limit

    // 获取新加载宝可梦的类型
    await fetchTypesForPokemons(pokemons.slice(0, 20))
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 处理类型选择
const handleTypeSelect = async (type: string) => {
  selectedType.value = type
  showFavorites.value = false
  
  if (type) {
    loading.value = true
    try {
      typedPokemons.value = await fetchPokemonsByType(type)
      // 获取类型宝可梦的详细信息
      await fetchTypesForPokemons(typedPokemons.value.slice(0, 20))
    } catch (error) {
      console.error('获取类型宝可梦失败:', error)
    } finally {
      loading.value = false
    }
  }
}

// 切换收藏显示
const toggleShowFavorites = () => {
  showFavorites.value = !showFavorites.value
  if (showFavorites.value) {
    selectedType.value = ''
  }
}

// 处理卡片点击
const handleCardClick = (pokemon: Pokemon) => {
  selectedPokemon.value = pokemon
  detailModalRef.value?.open()
}

// 处理详情点击
const handleDetail = (pokemon: Pokemon) => {
  selectedPokemon.value = pokemon
  detailModalRef.value?.open()
}

// 处理收藏切换
const handleToggleFavorite = (id: number) => {
  toggleFavorite(id)
}

// 组件挂载时初始化
onMounted(() => {
  init()
  
  // 设置无限滚动观察器
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !loadingMore.value && !loading.value) {
        loadMore()
      }
    },
    {
      rootMargin: '100px', // 提前 100px 触发
      threshold: 0.1
    }
  )
})

// 监听触发器元素
watch(loadMoreTrigger, (newEl, oldEl) => {
  if (oldEl && observer) {
    observer.unobserve(oldEl)
  }
  if (newEl && observer) {
    observer.observe(newEl)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>