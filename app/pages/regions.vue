<template>
  <div class="container mx-auto px-4 py-6">
    <Navbar />

    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold mb-2">🗺️ 地区探索</h1>
      <p class="text-base-content/60">探索宝可梦世界的各个地区</p>
    </div>

    <!-- 地区卡片网格 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="region in regions" 
        :key="region.name"
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
        @click="selectRegion(region)"
      >
        <div class="card-body">
          <!-- 地区图标和名称 -->
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full text-4xl">
              {{ getRegionEmoji(region.name) }}
            </div>
            <div>
              <h2 class="card-title capitalize group-hover:text-primary transition-colors">
                {{ getRegionNameZh(region.name) }}
              </h2>
              <p class="text-sm text-base-content/60 capitalize">{{ region.name }}</p>
            </div>
          </div>

          <!-- 地区信息（如果有详细数据） -->
          <template v-if="regionDetails[region.name]">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <span class="badge badge-primary badge-sm">
                  {{ regionDetails[region.name]?.locations?.length || 0 }} 个地点
                </span>
                <span v-if="regionDetails[region.name]?.main_generation" class="badge badge-secondary badge-sm">
                  第{{ getGenNumber(regionDetails[region.name]?.main_generation?.name) }}世代
                </span>
              </div>
              
              <!-- 版本组 -->
              <div v-if="regionDetails[region.name]?.version_groups?.length" class="text-xs text-base-content/50">
                出现于: {{ regionDetails[region.name]?.version_groups?.slice(0, 3).map((v: { name: string }) => v.name.replace(/-/g, ' ')).join(', ') }}
                <span v-if="(regionDetails[region.name]?.version_groups?.length || 0) > 3">等</span>
              </div>
            </div>
          </template>

          <div class="card-actions justify-end mt-4">
            <button class="btn btn-primary btn-sm group-hover:btn-wide transition-all">
              探索 →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 地区详情抽屉/模态框 -->
    <dialog ref="regionModal" class="modal">
      <div class="modal-box max-w-3xl max-h-[80vh]">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">✕</button>
        
        <template v-if="selectedRegion">
          <div class="mb-6">
            <div class="flex items-center gap-4">
              <span class="text-5xl">{{ getRegionEmoji(selectedRegion.name) }}</span>
              <div>
                <h2 class="text-2xl font-bold capitalize">{{ getRegionNameZh(selectedRegion.name) }}</h2>
                <p class="text-base-content/60 capitalize">{{ selectedRegion.name }} Region</p>
              </div>
            </div>
          </div>

          <!-- 世代和版本信息 -->
          <div class="flex flex-wrap gap-4 mb-6">
            <div v-if="selectedRegion.main_generation" class="stat bg-base-200 rounded-lg flex-1 min-w-[150px]">
              <div class="stat-title text-xs">主要世代</div>
              <div class="stat-value text-lg">第{{ getGenNumber(selectedRegion.main_generation.name) }}世代</div>
            </div>
            <div class="stat bg-base-200 rounded-lg flex-1 min-w-[150px]">
              <div class="stat-title text-xs">地点数量</div>
              <div class="stat-value text-lg">{{ selectedRegion.locations?.length || 0 }}</div>
            </div>
          </div>

          <!-- 宝可梦品种 -->
          <div v-if="selectedRegion.pokedexes?.length" class="mb-6">
            <h3 class="font-semibold mb-3">图鉴</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="dex in selectedRegion.pokedexes" 
                :key="dex.name"
                class="badge badge-primary badge-outline capitalize"
              >
                {{ dex.name.replace(/-/g, ' ') }}
              </span>
            </div>
          </div>

          <!-- 地点列表 -->
          <div v-if="selectedRegion.locations?.length">
            <h3 class="font-semibold mb-3">地点列表</h3>
            <div class="max-h-[300px] overflow-y-auto">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div 
                  v-for="loc in selectedRegion.locations" 
                  :key="loc.name"
                  class="p-2 bg-base-200 rounded text-sm capitalize hover:bg-base-300 transition-colors cursor-pointer"
                  @click="viewLocation(loc)"
                >
                  📍 {{ loc.name.replace(/-/g, ' ') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 版本组 -->
          <div v-if="selectedRegion.version_groups?.length" class="mt-6">
            <h3 class="font-semibold mb-3">相关游戏版本</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="vg in selectedRegion.version_groups" 
                :key="vg.name"
                class="badge badge-ghost capitalize"
              >
                {{ vg.name.replace(/-/g, ' ') }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- 地点详情模态框 -->
    <dialog ref="locationModal" class="modal">
      <div class="modal-box max-w-2xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeLocationModal">✕</button>
        
        <div v-if="locationLoading" class="flex justify-center items-center min-h-[200px]">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <template v-else-if="selectedLocation">
          <h2 class="text-xl font-bold capitalize mb-4">
            📍 {{ selectedLocation.name?.replace(/-/g, ' ') }}
          </h2>

          <!-- 地区区域 -->
          <div v-if="selectedLocation.areas?.length" class="mb-4">
            <h3 class="font-semibold text-sm mb-2">区域</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="area in selectedLocation.areas" 
                :key="area.name"
                class="badge badge-outline badge-sm capitalize"
              >
                {{ area.name.replace(/-/g, ' ') }}
              </span>
            </div>
          </div>

          <!-- 游戏描述 -->
          <div v-if="locationNames.length" class="mb-4">
            <h3 class="font-semibold text-sm mb-2">各语言名称</h3>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div 
                v-for="name in locationNames.slice(0, 6)" 
                :key="name.language.name"
                class="flex justify-between bg-base-200 rounded p-2"
              >
                <span class="text-base-content/60 uppercase">{{ name.language.name }}</span>
                <span>{{ name.name }}</span>
              </div>
            </div>
          </div>

          <!-- 出现游戏 -->
          <div v-if="selectedLocation.game_indices?.length" class="text-sm text-base-content/60">
            出现于 {{ selectedLocation.game_indices.length }} 个游戏版本
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
import type { Region, Location } from '~/types/location'
import { usePokeData } from '~/composables/usePokeData'

const { fetchRegions, fetchRegion, fetchLocation } = usePokeData()

const loading = ref(true)
const regions = ref<{ name: string; url: string }[]>([])
const regionDetails = ref<Record<string, Region>>({})
const selectedRegion = ref<Region | null>(null)
const selectedLocation = ref<Location | null>(null)
const locationLoading = ref(false)

const regionModal = ref<HTMLDialogElement | null>(null)
const locationModal = ref<HTMLDialogElement | null>(null)

// 地区中文名称映射
const REGION_NAMES_ZH: Record<string, string> = {
  'kanto': '关都',
  'johto': '城都',
  'hoenn': '丰缘',
  'sinnoh': '神奥',
  'unova': '合众',
  'kalos': '卡洛斯',
  'alola': '阿罗拉',
  'galar': '伽勒尔',
  'hisui': '洗翠',
  'paldea': '帕底亚'
}

// 地区表情映射
const REGION_EMOJIS: Record<string, string> = {
  'kanto': '🏯',
  'johto': '⛩️',
  'hoenn': '🌊',
  'sinnoh': '🏔️',
  'unova': '🗽',
  'kalos': '🗼',
  'alola': '🌺',
  'galar': '🏰',
  'hisui': '⛰️',
  'paldea': '🌄'
}

const getRegionNameZh = (name: string) => REGION_NAMES_ZH[name] || name
const getRegionEmoji = (name: string) => REGION_EMOJIS[name] || '🗺️'

const getGenNumber = (genName: string | undefined): string => {
  if (!genName) return ''
  const match = genName.match(/generation-(\w+)/i)
  if (!match || !match[1]) return ''
  const romanToNum: Record<string, string> = {
    'i': '1', 'ii': '2', 'iii': '3', 'iv': '4', 'v': '5',
    'vi': '6', 'vii': '7', 'viii': '8', 'ix': '9'
  }
  return romanToNum[match[1]] || match[1]
}

const locationNames = computed(() => {
  return selectedLocation.value?.names || []
})

// 加载所有地区
const loadRegions = async () => {
  loading.value = true
  try {
    const data = await fetchRegions()
    regions.value = data
    
    // 并行加载所有地区详情
    const details = await Promise.all(
      data.map((r: { name: string; url: string }) => fetchRegion(r.name))
    )
    
    details.forEach((detail: Region, index: number) => {
      if (detail && data[index]) {
        regionDetails.value[data[index].name] = detail
      }
    })
  } catch (error) {
    console.error('Failed to load regions:', error)
  } finally {
    loading.value = false
  }
}

// 选择地区
const selectRegion = async (region: { name: string; url: string }) => {
  const detail = regionDetails.value[region.name]
  if (detail) {
    selectedRegion.value = detail
  } else {
    selectedRegion.value = await fetchRegion(region.name)
  }
  regionModal.value?.showModal()
}

// 查看地点
const viewLocation = async (loc: { name: string; url: string }) => {
  locationLoading.value = true
  selectedLocation.value = null
  locationModal.value?.showModal()
  
  try {
    selectedLocation.value = await fetchLocation(loc.name)
  } catch (error) {
    console.error('Failed to load location:', error)
  } finally {
    locationLoading.value = false
  }
}

const closeModal = () => {
  regionModal.value?.close()
}

const closeLocationModal = () => {
  locationModal.value?.close()
}

// 初始化
onMounted(() => {
  loadRegions()
})
</script>
