<template>
  <div class="container mx-auto px-4 py-6">
    <Navbar />

    <!-- 页面标题 -->
    <div class="hero bg-base-100 rounded-box mb-6 shadow-lg">
      <div class="hero-content text-center py-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-green-500 to-lime-500 bg-clip-text text-transparent">
            🍇 树果图鉴
          </h1>
          <p class="py-4 text-base-content/70">
            探索各种树果，了解它们的属性和用途
          </p>
          <div class="stats shadow">
            <div class="stat place-items-center">
              <div class="stat-title">树果总数</div>
              <div class="stat-value text-green-500">{{ total }}</div>
            </div>
            <div class="stat place-items-center">
              <div class="stat-title">已加载</div>
              <div class="stat-value text-lime-500">{{ berries.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="mb-6 p-4 bg-base-100 rounded-box shadow">
      <div class="flex flex-col sm:flex-row gap-4">
        <input 
          v-model="searchText"
          type="text"
          placeholder="搜索树果名称..."
          class="input input-bordered flex-1"
        />
        <select v-model="selectedFirmness" class="select select-bordered w-full sm:w-48">
          <option value="">全部硬度</option>
          <option 
            v-for="f in firmnesses" 
            :key="f.name" 
            :value="f.name"
          >
            {{ FIRMNESS_NAMES_ZH[f.name] || f.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- 树果列表 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div 
        v-for="berry in filteredBerries" 
        :key="berry.name"
        class="card bg-base-100 shadow hover:shadow-lg transition-all cursor-pointer group"
        @click="openDetail(berry.name)"
      >
        <div class="card-body items-center p-4">
          <!-- 树果图片 -->
          <div class="w-16 h-16 flex items-center justify-center">
            <img 
              v-if="berryDetails[berry.name]"
              :src="getBerrySprite(berryDetails[berry.name]?.item?.name || berry.name + '-berry')"
              :alt="berry.name"
              class="w-full h-full object-contain group-hover:scale-110 transition-transform"
              loading="lazy"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
            />
            <span v-else class="text-4xl">🍇</span>
          </div>
          
          <!-- 树果名称 -->
          <h3 class="text-sm font-medium text-center mt-2 group-hover:text-primary transition-colors">
            {{ getBerryName(berry) }}
          </h3>

          <!-- 自然礼物属性 -->
          <div v-if="berryDetails[berry.name]?.natural_gift_type" class="mt-1">
            <span 
              class="badge badge-sm text-white"
              :style="{ backgroundColor: TYPE_COLORS[berryDetails[berry.name]?.natural_gift_type?.name || ''] || '#777' }"
            >
              {{ TYPE_NAMES_ZH[berryDetails[berry.name]?.natural_gift_type?.name || ''] || berryDetails[berry.name]?.natural_gift_type?.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无限滚动触发器 -->
    <div 
      ref="loadMoreTrigger"
      v-if="!loading && hasMore && !searchText && !selectedFirmness" 
      class="text-center py-8"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-sm text-base-content/60 mt-2">加载更多...</p>
    </div>

    <!-- 树果详情模态框 -->
    <dialog ref="detailModal" class="modal">
      <div class="modal-box max-w-lg">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeDetail">✕</button>
        
        <div v-if="detailLoading" class="flex justify-center items-center min-h-[200px]">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <template v-else-if="selectedBerry">
          <!-- 头部 -->
          <div class="flex items-center gap-4 mb-6">
            <div class="w-20 h-20 flex items-center justify-center bg-base-200 rounded-full">
              <img 
                :src="getBerrySprite(selectedBerry.item?.name || selectedBerry.name + '-berry')"
                :alt="selectedBerry.name"
                class="w-16 h-16 object-contain"
                @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ getBerryNameFromDetail(selectedBerry) }}</h2>
              <p class="text-sm text-base-content/60 capitalize">{{ selectedBerry.name }} Berry · #{{ selectedBerry.id }}</p>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">大小</div>
              <div class="stat-value text-lg">{{ selectedBerry.size }} mm</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">硬度</div>
              <div class="stat-value text-lg text-sm">{{ FIRMNESS_NAMES_ZH[selectedBerry.firmness?.name] || selectedBerry.firmness?.name }}</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">生长时间</div>
              <div class="stat-value text-lg">{{ selectedBerry.growth_time }}h</div>
            </div>
            <div class="stat bg-base-200 rounded-lg p-3">
              <div class="stat-title text-xs">最大收获</div>
              <div class="stat-value text-lg">{{ selectedBerry.max_harvest }}</div>
            </div>
          </div>

          <!-- 自然礼物 -->
          <div class="mb-4">
            <h3 class="font-semibold text-sm mb-2">自然礼物</h3>
            <div class="flex items-center gap-3">
              <span 
                v-if="selectedBerry.natural_gift_type"
                class="badge text-white"
                :style="{ backgroundColor: TYPE_COLORS[selectedBerry.natural_gift_type.name] || '#777' }"
              >
                {{ TYPE_NAMES_ZH[selectedBerry.natural_gift_type.name] || selectedBerry.natural_gift_type.name }}
              </span>
              <span class="text-sm">威力: {{ selectedBerry.natural_gift_power }}</span>
            </div>
          </div>

          <!-- 口味 -->
          <div class="mb-4">
            <h3 class="font-semibold text-sm mb-2">口味</h3>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="flavor in selectedBerry.flavors" 
                :key="flavor.flavor.name"
                class="flex items-center gap-1"
              >
                <span class="badge badge-outline capitalize">
                  {{ FLAVOR_NAMES_ZH[flavor.flavor.name] || flavor.flavor.name }}
                </span>
                <div class="flex">
                  <span 
                    v-for="i in Math.min(flavor.potency, 5)" 
                    :key="i"
                    class="text-yellow-500 text-xs"
                  >★</span>
                  <span 
                    v-for="i in Math.max(0, 5 - flavor.potency)" 
                    :key="'empty-' + i"
                    class="text-base-content/20 text-xs"
                  >★</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他属性 -->
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between bg-base-200 rounded p-2">
              <span class="text-base-content/60">光滑度</span>
              <span>{{ selectedBerry.smoothness }}</span>
            </div>
            <div class="flex justify-between bg-base-200 rounded p-2">
              <span class="text-base-content/60">土壤干燥度</span>
              <span>{{ selectedBerry.soil_dryness }}</span>
            </div>
          </div>
        </template>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { Berry } from '~/types/berry'
import { FIRMNESS_NAMES_ZH, BERRY_NAMES_ZH } from '~/types/berry'
import { FLAVOR_NAMES_ZH } from '~/types/nature'
import { TYPE_COLORS, TYPE_NAMES_ZH } from '~/types/pokemon'
import { usePokeData } from '~/composables/usePokeData'

const { fetchBerries, fetchBerry, fetchBerryFirmnesses, getBerrySprite } = usePokeData()

const loading = ref(true)
const detailLoading = ref(false)
const berries = ref<Array<{ name: string; url: string }>>([])
const berryDetails = ref<Record<string, Berry>>({})
const firmnesses = ref<Array<{ name: string; url: string }>>([])
const total = ref(0)
const offset = ref(0)
const limit = 30

const searchText = ref('')
const selectedFirmness = ref('')
const selectedBerry = ref<Berry | null>(null)

const detailModal = ref<HTMLDialogElement | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const hasMore = computed(() => berries.value.length < total.value)

// 筛选后的树果列表
const filteredBerries = computed(() => {
  let result = berries.value

  // 搜索筛选
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(b => {
      const zhName = BERRY_NAMES_ZH[b.name] || ''
      return b.name.includes(search) || zhName.includes(search)
    })
  }

  // 硬度筛选
  if (selectedFirmness.value) {
    result = result.filter(b => {
      const detail = berryDetails.value[b.name]
      return detail?.firmness?.name === selectedFirmness.value
    })
  }

  return result
})

// 获取树果中文名
const getBerryName = (berry: { name: string }) => {
  return BERRY_NAMES_ZH[berry.name] || berry.name + '果'
}

const getBerryNameFromDetail = (berry: Berry) => {
  return BERRY_NAMES_ZH[berry.name] || berry.name + '果'
}

// 加载树果列表
const loadBerries = async () => {
  loading.value = true
  try {
    const [berriesData, firmnessData] = await Promise.all([
      fetchBerries(limit, 0),
      fetchBerryFirmnesses()
    ])
    
    berries.value = berriesData.berries
    total.value = berriesData.total
    offset.value = limit
    firmnesses.value = firmnessData

    // 加载前20个树果的详情
    await loadBerryDetails(berriesData.berries.slice(0, 20))
  } catch (error) {
    console.error('Failed to load berries:', error)
  } finally {
    loading.value = false
  }
}

// 批量加载树果详情
const loadBerryDetails = async (list: Array<{ name: string; url: string }>) => {
  const promises = list.map(async (b) => {
    if (!berryDetails.value[b.name]) {
      try {
        const detail = await fetchBerry(b.name)
        berryDetails.value[b.name] = detail
      } catch (e) {
        // ignore
      }
    }
  })
  await Promise.all(promises)
}

// 加载更多
const loadMore = async () => {
  if (loading.value) return
  
  try {
    const data = await fetchBerries(limit, offset.value)
    berries.value = [...berries.value, ...data.berries]
    offset.value += limit
    
    await loadBerryDetails(data.berries.slice(0, 20))
  } catch (error) {
    console.error('Failed to load more:', error)
  }
}

// 打开详情
const openDetail = async (name: string) => {
  detailModal.value?.showModal()
  detailLoading.value = true
  
  try {
    selectedBerry.value = await fetchBerry(name)
  } catch (error) {
    console.error('Failed to load berry detail:', error)
  } finally {
    detailLoading.value = false
  }
}

const closeDetail = () => {
  detailModal.value?.close()
}

onMounted(() => {
  loadBerries()
  
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && !loading.value) {
        loadMore()
      }
    },
    { rootMargin: '100px', threshold: 0.1 }
  )
})

watch(loadMoreTrigger, (newEl, oldEl) => {
  if (oldEl && observer) observer.unobserve(oldEl)
  if (newEl && observer) observer.observe(newEl)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
