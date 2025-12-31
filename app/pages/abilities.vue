<template>
  <div class="container mx-auto px-4 py-6">
    <Navbar />

    <!-- 页面标题 -->
    <div class="hero bg-base-100 rounded-box mb-6 shadow-lg">
      <div class="hero-content text-center py-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ✨ 特性图鉴
          </h1>
          <p class="py-4 text-base-content/70">
            探索宝可梦特性，了解它们的效果
          </p>
          <div class="stats shadow">
            <div class="stat place-items-center">
              <div class="stat-title">特性总数</div>
              <div class="stat-value text-purple-500">{{ total }}</div>
            </div>
            <div class="stat place-items-center">
              <div class="stat-title">已加载</div>
              <div class="stat-value text-pink-500">{{ abilities.length }}</div>
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
          placeholder="搜索特性名称..."
          class="input input-bordered flex-1"
        />
        <select v-model="selectedGeneration" class="select select-bordered w-full sm:w-48">
          <option value="">全部世代</option>
          <option 
            v-for="gen in generations" 
            :key="gen.name" 
            :value="gen.name"
          >
            {{ GENERATION_NAMES_ZH[gen.name] || gen.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- 特性列表 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="ability in filteredAbilities" 
        :key="ability.name"
        class="card bg-base-100 shadow hover:shadow-lg transition-all cursor-pointer group"
        @click="openDetail(ability.name)"
      >
        <div class="card-body p-4">
          <h3 class="card-title text-base capitalize group-hover:text-primary transition-colors">
            {{ getAbilityName(ability) }}
          </h3>
          <p v-if="abilityDetails[ability.name]" class="text-sm text-base-content/60 line-clamp-2">
            {{ getShortEffect(abilityDetails[ability.name]!) }}
          </p>
          <div class="card-actions justify-end mt-2">
            <span v-if="abilityDetails[ability.name]" class="badge badge-ghost badge-sm">
              {{ GENERATION_NAMES_ZH[abilityDetails[ability.name]!.generation?.name] || '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无限滚动触发器 -->
    <div 
      ref="loadMoreTrigger"
      v-if="!loading && hasMore && !searchText && !selectedGeneration" 
      class="text-center py-8"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-sm text-base-content/60 mt-2">加载更多...</p>
    </div>

    <!-- 特性详情模态框 -->
    <dialog ref="detailModal" class="modal">
      <div class="modal-box max-w-2xl">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeDetail">✕</button>
        
        <div v-if="detailLoading" class="flex justify-center items-center min-h-[200px]">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <template v-else-if="selectedAbility">
          <h2 class="text-2xl font-bold capitalize mb-2">
            {{ getAbilityNameFromDetail(selectedAbility) }}
          </h2>
          <p class="text-sm text-base-content/60 mb-4 capitalize">
            {{ selectedAbility.name.replace(/-/g, ' ') }} · #{{ selectedAbility.id }}
          </p>

          <!-- 世代 -->
          <div class="badge badge-primary mb-4">
            {{ GENERATION_NAMES_ZH[selectedAbility.generation?.name] || selectedAbility.generation?.name }}
          </div>

          <!-- 效果描述 -->
          <div class="mb-4">
            <h3 class="font-semibold text-sm mb-2">效果</h3>
            <p class="text-sm text-base-content/80 leading-relaxed">
              {{ getEffect(selectedAbility) }}
            </p>
          </div>

          <!-- 简短效果 -->
          <div v-if="getShortEffect(selectedAbility)" class="mb-4">
            <h3 class="font-semibold text-sm mb-2">简短效果</h3>
            <p class="text-sm text-base-content/60">
              {{ getShortEffect(selectedAbility) }}
            </p>
          </div>

          <!-- 游戏描述 -->
          <div v-if="getFlavorText(selectedAbility)" class="mb-4">
            <h3 class="font-semibold text-sm mb-2">游戏描述</h3>
            <div class="bg-base-200 rounded-lg p-3">
              <p class="text-sm italic text-base-content/70">
                "{{ getFlavorText(selectedAbility) }}"
              </p>
            </div>
          </div>

          <!-- 拥有此特性的宝可梦 -->
          <div v-if="selectedAbility.pokemon?.length">
            <h3 class="font-semibold text-sm mb-2">
              拥有此特性的宝可梦 ({{ selectedAbility.pokemon.length }})
            </h3>
            <div class="max-h-[200px] overflow-y-auto">
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="p in selectedAbility.pokemon.slice(0, 30)" 
                  :key="p.pokemon.name"
                  class="badge capitalize"
                  :class="p.is_hidden ? 'badge-ghost' : 'badge-outline'"
                >
                  {{ p.pokemon.name.replace(/-/g, ' ') }}
                  <span v-if="p.is_hidden" class="text-xs ml-1">(隐藏)</span>
                </span>
                <span v-if="selectedAbility.pokemon.length > 30" class="badge badge-ghost">
                  +{{ selectedAbility.pokemon.length - 30 }} 更多
                </span>
              </div>
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
import type { Ability } from '~/types/ability'
import { GENERATION_NAMES_ZH } from '~/types/ability'
import { usePokeData } from '~/composables/usePokeData'

const { fetchAbilitiesList, fetchAbilityDetail, fetchGenerations } = usePokeData()

const loading = ref(true)
const detailLoading = ref(false)
const abilities = ref<Array<{ name: string; url: string }>>([])
const abilityDetails = ref<Record<string, Ability>>({})
const generations = ref<Array<{ name: string; url: string }>>([])
const total = ref(0)
const offset = ref(0)
const limit = 50

const searchText = ref('')
const selectedGeneration = ref('')
const selectedAbility = ref<Ability | null>(null)

const detailModal = ref<HTMLDialogElement | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const hasMore = computed(() => abilities.value.length < total.value)

// 筛选后的特性列表
const filteredAbilities = computed(() => {
  let result = abilities.value

  // 搜索筛选
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(a => {
      const detail = abilityDetails.value[a.name]
      const zhName = detail?.names?.find(n => 
        n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
      )?.name || ''
      return a.name.includes(search) || zhName.toLowerCase().includes(search)
    })
  }

  // 世代筛选
  if (selectedGeneration.value) {
    result = result.filter(a => {
      const detail = abilityDetails.value[a.name]
      return detail?.generation?.name === selectedGeneration.value
    })
  }

  return result
})

// 获取特性中文名
const getAbilityName = (ability: { name: string }) => {
  const detail = abilityDetails.value[ability.name]
  if (!detail) return ability.name.replace(/-/g, ' ')
  const zhName = detail.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || ability.name.replace(/-/g, ' ')
}

const getAbilityNameFromDetail = (ability: Ability) => {
  const zhName = ability.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || ability.name.replace(/-/g, ' ')
}

// 获取效果文本
const getEffect = (ability: Ability) => {
  const entry = ability.effect_entries?.find(e => e.language.name === 'en')
  return entry?.effect || '暂无效果描述'
}

const getShortEffect = (ability: Ability) => {
  const entry = ability.effect_entries?.find(e => e.language.name === 'en')
  return entry?.short_effect || ''
}

const getFlavorText = (ability: Ability) => {
  const entry = ability.flavor_text_entries?.find(e => e.language.name === 'en')
  return entry?.flavor_text?.replace(/\n/g, ' ') || ''
}

// 加载特性列表
const loadAbilities = async () => {
  loading.value = true
  try {
    const [abilitiesData, genData] = await Promise.all([
      fetchAbilitiesList(limit, 0),
      fetchGenerations()
    ])
    
    abilities.value = abilitiesData.abilities
    total.value = abilitiesData.total
    offset.value = limit
    generations.value = genData

    // 加载前20个特性的详情
    await loadAbilityDetails(abilitiesData.abilities.slice(0, 20))
  } catch (error) {
    console.error('Failed to load abilities:', error)
  } finally {
    loading.value = false
  }
}

// 批量加载特性详情
const loadAbilityDetails = async (list: Array<{ name: string; url: string }>) => {
  const promises = list.map(async (a) => {
    if (!abilityDetails.value[a.name]) {
      try {
        const detail = await fetchAbilityDetail(a.name)
        abilityDetails.value[a.name] = detail
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
    const data = await fetchAbilitiesList(limit, offset.value)
    abilities.value = [...abilities.value, ...data.abilities]
    offset.value += limit
    
    // 加载新特性的详情
    await loadAbilityDetails(data.abilities.slice(0, 20))
  } catch (error) {
    console.error('Failed to load more:', error)
  }
}

// 打开详情
const openDetail = async (name: string) => {
  detailModal.value?.showModal()
  detailLoading.value = true
  
  try {
    selectedAbility.value = await fetchAbilityDetail(name)
  } catch (error) {
    console.error('Failed to load ability detail:', error)
  } finally {
    detailLoading.value = false
  }
}

const closeDetail = () => {
  detailModal.value?.close()
}

onMounted(() => {
  loadAbilities()
  
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
