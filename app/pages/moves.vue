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
            <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              招式图鉴
            </h1>
            <p class="py-4 text-base-content/70 max-w-md mx-auto">
              浏览所有宝可梦招式，了解威力、命中率和效果
            </p>
            <div class="stats shadow">
              <div class="stat place-items-center">
                <div class="stat-title">招式总数</div>
                <div class="stat-value text-primary">{{ total }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">已加载</div>
                <div class="stat-value text-secondary">{{ moves.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="mb-6 p-4 bg-base-100 rounded-box shadow flex flex-wrap gap-4 items-center">
        <!-- 搜索 -->
        <div class="form-control">
          <input 
            v-model="searchText"
            type="text"
            placeholder="搜索招式名称..."
            class="input input-bordered w-64"
          />
        </div>
        
        <!-- 属性筛选 -->
        <select v-model="selectedType" class="select select-bordered">
          <option value="">全部属性</option>
          <option v-for="type in types" :key="type" :value="type">
            {{ TYPE_NAMES_ZH[type] || type }}
          </option>
        </select>

        <!-- 伤害类型筛选 -->
        <div class="btn-group">
          <button 
            class="btn btn-sm"
            :class="{ 'btn-active': !selectedDamageClass }"
            @click="selectedDamageClass = ''"
          >
            全部
          </button>
          <button 
            v-for="dc in damageClasses" 
            :key="dc"
            class="btn btn-sm"
            :class="{ 'btn-active': selectedDamageClass === dc }"
            @click="selectedDamageClass = dc"
          >
            {{ DAMAGE_CLASS_ICONS[dc] }} {{ DAMAGE_CLASS_NAMES[dc] }}
          </button>
        </div>
      </div>

      <!-- 招式列表 -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 12" :key="i" class="card bg-base-100 shadow">
          <div class="card-body">
            <div class="skeleton h-6 w-32"></div>
            <div class="skeleton h-4 w-full mt-2"></div>
            <div class="skeleton h-4 w-3/4 mt-1"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MoveCard 
          v-for="move in filteredMoves" 
          :key="move.id" 
          :move="move"
          @click="openMoveDetail(move)"
        />
      </div>

      <!-- 无限滚动触发器 -->
      <div 
        ref="loadMoreTrigger"
        v-if="!loading && hasMore && !selectedType" 
        class="text-center py-8"
      >
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-sm text-base-content/60 mt-2">
          加载更多招式... ({{ moves.length }} / {{ total }})
        </p>
      </div>

      <!-- 已加载全部 -->
      <div 
        v-if="!loading && !hasMore && moves.length > 0" 
        class="text-center py-8"
      >
        <p class="text-sm text-base-content/60">
          ✨ 已加载全部 {{ filteredMoves.length }} 个招式
        </p>
      </div>
    </div>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 招式详情模态框 -->
    <MoveDetailModal ref="moveDetailModalRef" :move="selectedMove" />
  </div>
</template>

<script setup lang="ts">
import type { Move } from '~/types/move'
import { DAMAGE_CLASS_NAMES, DAMAGE_CLASS_ICONS } from '~/types/move'
import { TYPE_NAMES_ZH } from '~/types/pokemon'

const { fetchMoves, fetchMove, fetchMovesByType } = usePokeData()

// 状态
const moves = ref<Move[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const total = ref(0)
const offset = ref(0)
const limit = 50

// 筛选
const searchText = ref('')
const selectedType = ref('')
const selectedDamageClass = ref('')
const types = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
const damageClasses = ['physical', 'special', 'status']

// 模态框
const moveDetailModalRef = ref<{ open: () => void } | null>(null)
const selectedMove = ref<Move | null>(null)

// 无限滚动
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 是否还有更多
const hasMore = computed(() => moves.value.length < total.value)

// 筛选后的招式
const filteredMoves = computed(() => {
  let result = moves.value

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(search))
  }

  // 属性过滤
  if (selectedType.value) {
    result = result.filter(m => m.type.name === selectedType.value)
  }

  // 伤害类型过滤
  if (selectedDamageClass.value) {
    result = result.filter(m => m.damage_class.name === selectedDamageClass.value)
  }

  return result
})

// 初始化
const init = async () => {
  loading.value = true
  try {
    const { moves: moveList, total: totalCount } = await fetchMoves(limit, 0)
    total.value = totalCount
    offset.value = limit

    // 获取招式详情
    const details = await Promise.all(
      moveList.slice(0, 30).map(m => fetchMove(m.name))
    )
    moves.value = details
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
    const { moves: moveList } = await fetchMoves(limit, offset.value)
    offset.value += limit

    // 获取招式详情
    const details = await Promise.all(
      moveList.slice(0, 30).map(m => fetchMove(m.name))
    )
    moves.value = [...moves.value, ...details]
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 打开招式详情
const openMoveDetail = (move: Move) => {
  selectedMove.value = move
  moveDetailModalRef.value?.open()
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
