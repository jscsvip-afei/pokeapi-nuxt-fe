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
            <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
              道具图鉴
            </h1>
            <p class="py-4 text-base-content/70 max-w-md mx-auto">
              浏览所有宝可梦道具，了解效果和用途
            </p>
            <div class="stats shadow">
              <div class="stat place-items-center">
                <div class="stat-title">道具总数</div>
                <div class="stat-value text-primary">{{ total }}</div>
              </div>
              <div class="stat place-items-center">
                <div class="stat-title">已加载</div>
                <div class="stat-value text-secondary">{{ items.length }}</div>
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
            placeholder="搜索道具名称..."
            class="input input-bordered w-64"
          />
        </div>
        
        <!-- 分类筛选 -->
        <select v-model="selectedCategory" class="select select-bordered">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat.name" :value="cat.name">
            {{ ITEM_CATEGORY_NAMES[cat.name] || cat.name }}
          </option>
        </select>
      </div>

      <!-- 道具列表 -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div v-for="i in 18" :key="i" class="card bg-base-100 shadow">
          <div class="card-body items-center p-4">
            <div class="skeleton w-12 h-12 rounded"></div>
            <div class="skeleton h-4 w-20 mt-2"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <ItemCard 
          v-for="item in filteredItems" 
          :key="item.id" 
          :item="item"
          @click="openItemDetail(item)"
        />
      </div>

      <!-- 无限滚动触发器 -->
      <div 
        ref="loadMoreTrigger"
        v-if="!loading && hasMore && !selectedCategory" 
        class="text-center py-8"
      >
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-sm text-base-content/60 mt-2">
          加载更多道具... ({{ items.length }} / {{ total }})
        </p>
      </div>
    </div>

    <!-- 页脚 -->
    <AppFooter />

    <!-- 道具详情模态框 -->
    <ItemDetailModal ref="itemDetailModalRef" :item="selectedItem" />
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/types/item'
import { ITEM_CATEGORY_NAMES } from '~/types/item'

const { fetchItems, fetchItem, fetchItemCategories, fetchItemCategory } = usePokeData()

// 状态
const items = ref<Item[]>([])
const categories = ref<Array<{ name: string; url: string }>>([])
const loading = ref(true)
const loadingMore = ref(false)
const total = ref(0)
const offset = ref(0)
const limit = 50

// 筛选
const searchText = ref('')
const selectedCategory = ref('')

// 模态框
const itemDetailModalRef = ref<{ open: (itemId: number | string) => void } | null>(null)
const selectedItem = ref<Item | null>(null)

// 无限滚动
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 是否还有更多
const hasMore = computed(() => items.value.length < total.value)

// 筛选后的道具
const filteredItems = computed(() => {
  let result = items.value

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(i => i.name.toLowerCase().includes(search))
  }

  // 分类过滤
  if (selectedCategory.value) {
    result = result.filter(i => i.category.name === selectedCategory.value)
  }

  return result
})

// 初始化
const init = async () => {
  loading.value = true
  try {
    const [itemsData, categoriesData] = await Promise.all([
      fetchItems(limit, 0),
      fetchItemCategories()
    ])
    
    total.value = itemsData.total
    offset.value = limit
    categories.value = categoriesData

    // 获取道具详情
    const details = await Promise.all(
      itemsData.items.slice(0, 30).map(i => fetchItem(i.name))
    )
    items.value = details
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
    const { items: itemList } = await fetchItems(limit, offset.value)
    offset.value += limit

    // 获取道具详情
    const details = await Promise.all(
      itemList.slice(0, 30).map(i => fetchItem(i.name))
    )
    items.value = [...items.value, ...details]
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 打开道具详情
const openItemDetail = (item: Item) => {
  selectedItem.value = item
  itemDetailModalRef.value?.open(item.name)
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
