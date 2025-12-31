<template>
  <div class="container mx-auto px-4 py-6">
    <Navbar />

    <!-- 页面标题 -->
    <div class="hero bg-base-100 rounded-box mb-6 shadow-lg">
      <div class="hero-content text-center py-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            🎭 性格图鉴
          </h1>
          <p class="py-4 text-base-content/70">
            了解25种性格对宝可梦能力值的影响
          </p>
        </div>
      </div>
    </div>

    <!-- 性格说明 -->
    <div class="alert alert-info mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>性格会使一项能力值提升10%（<span class="text-success font-bold">↑</span>），另一项降低10%（<span class="text-error font-bold">↓</span>）。部分性格为中性，不影响能力值。</span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- 性格表格 -->
    <div v-else class="overflow-x-auto bg-base-100 rounded-box shadow-lg">
      <table class="table table-zebra">
        <thead>
          <tr class="bg-base-200">
            <th class="text-center">性格</th>
            <th class="text-center">英文</th>
            <th class="text-center text-success">提升 ↑</th>
            <th class="text-center text-error">降低 ↓</th>
            <th class="text-center">喜欢口味</th>
            <th class="text-center">讨厌口味</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="nature in sortedNatures" 
            :key="nature.name"
            class="hover"
            :class="{ 'bg-base-200/50': isNeutral(nature) }"
          >
            <td class="text-center font-medium">
              {{ NATURE_NAMES_ZH[nature.name] || nature.name }}
              <span v-if="isNeutral(nature)" class="badge badge-ghost badge-sm ml-1">中性</span>
            </td>
            <td class="text-center capitalize text-base-content/60">
              {{ nature.name }}
            </td>
            <td class="text-center">
              <span v-if="nature.increased_stat" class="badge badge-success">
                {{ STAT_NAMES_ZH[nature.increased_stat.name] || nature.increased_stat.name }}
              </span>
              <span v-else class="text-base-content/40">-</span>
            </td>
            <td class="text-center">
              <span v-if="nature.decreased_stat" class="badge badge-error">
                {{ STAT_NAMES_ZH[nature.decreased_stat.name] || nature.decreased_stat.name }}
              </span>
              <span v-else class="text-base-content/40">-</span>
            </td>
            <td class="text-center">
              <span v-if="nature.likes_flavor" class="badge badge-outline">
                {{ FLAVOR_NAMES_ZH[nature.likes_flavor.name] || nature.likes_flavor.name }}
              </span>
              <span v-else class="text-base-content/40">-</span>
            </td>
            <td class="text-center">
              <span v-if="nature.hates_flavor" class="badge badge-ghost">
                {{ FLAVOR_NAMES_ZH[nature.hates_flavor.name] || nature.hates_flavor.name }}
              </span>
              <span v-else class="text-base-content/40">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 性格矩阵图 -->
    <div class="mt-8 bg-base-100 rounded-box shadow-lg p-6">
      <h2 class="text-xl font-bold mb-4">📊 性格矩阵</h2>
      <p class="text-sm text-base-content/60 mb-4">行为降低的能力值，列为提升的能力值</p>
      
      <div class="overflow-x-auto">
        <table class="table table-sm">
          <thead>
            <tr>
              <th class="bg-base-200"></th>
              <th v-for="stat in statOrder" :key="stat" class="text-center bg-success/20 text-success text-xs">
                {{ STAT_NAMES_ZH[stat] }}↑
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="decreasedStat in statOrder" :key="decreasedStat">
              <td class="bg-error/20 text-error text-xs font-medium">{{ STAT_NAMES_ZH[decreasedStat] }}↓</td>
              <td 
                v-for="increasedStat in statOrder" 
                :key="increasedStat"
                class="text-center text-sm"
                :class="decreasedStat === increasedStat ? 'bg-base-200' : ''"
              >
                {{ getNatureByStats(increasedStat, decreasedStat) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { Nature } from '~/types/nature'
import { STAT_NAMES_ZH, FLAVOR_NAMES_ZH, NATURE_NAMES_ZH } from '~/types/nature'
import { usePokeData } from '~/composables/usePokeData'

const { fetchNaturesList, fetchNatureDetail } = usePokeData()

const loading = ref(true)
const natures = ref<Nature[]>([])

// 能力值顺序（不包含HP）
const statOrder = ['attack', 'defense', 'special-attack', 'special-defense', 'speed']

// 排序后的性格列表
const sortedNatures = computed(() => {
  return [...natures.value].sort((a, b) => {
    // 中性性格排在最后
    const aIsNeutral = isNeutral(a)
    const bIsNeutral = isNeutral(b)
    if (aIsNeutral && !bIsNeutral) return 1
    if (!aIsNeutral && bIsNeutral) return -1
    return a.id - b.id
  })
})

// 判断是否为中性性格
const isNeutral = (nature: Nature) => {
  return !nature.increased_stat || !nature.decreased_stat || 
         nature.increased_stat.name === nature.decreased_stat.name
}

// 根据能力值变化获取性格名
const getNatureByStats = (increased: string, decreased: string) => {
  if (increased === decreased) {
    // 对角线上的是中性性格
    const neutralNatures = natures.value.filter(n => 
      n.increased_stat?.name === increased && n.decreased_stat?.name === decreased
    )
    if (neutralNatures.length > 0 && neutralNatures[0]) {
      return NATURE_NAMES_ZH[neutralNatures[0].name] || neutralNatures[0].name
    }
    return '-'
  }
  
  const nature = natures.value.find(n => 
    n.increased_stat?.name === increased && n.decreased_stat?.name === decreased
  )
  return nature ? (NATURE_NAMES_ZH[nature.name] || nature.name) : '-'
}

// 加载性格数据
const loadNatures = async () => {
  loading.value = true
  try {
    const list = await fetchNaturesList()
    
    // 并行获取所有性格详情
    const details = await Promise.all(
      list.map((n: { name: string }) => fetchNatureDetail(n.name))
    )
    
    natures.value = details
  } catch (error) {
    console.error('Failed to load natures:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNatures()
})
</script>
