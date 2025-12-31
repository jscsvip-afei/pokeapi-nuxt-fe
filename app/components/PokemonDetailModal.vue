<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box sm:max-w-3xl">
      <!-- 关闭按钮 -->
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-base-content/60">加载中...</p>
      </div>

      <!-- 内容 -->
      <div v-else-if="detail" class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧图片区 -->
        <div class="flex-shrink-0">
          <div class="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 relative">
            <!-- 收藏按钮 -->
            <button 
              class="btn btn-circle btn-sm absolute top-2 right-2"
              @click="$emit('toggleFavorite', detail.id)"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" 
                :fill="isFavorite ? 'currentColor' : 'none'"
                :class="isFavorite ? 'text-error' : 'text-base-content'"
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <!-- 图片切换 -->
            <div class="tabs tabs-boxed mb-4 justify-center">
              <button 
                class="tab tab-sm" 
                :class="{ 'tab-active': spriteType === 'artwork' }"
                @click="spriteType = 'artwork'"
              >官方</button>
              <button 
                class="tab tab-sm" 
                :class="{ 'tab-active': spriteType === 'default' }"
                @click="spriteType = 'default'"
              >像素</button>
              <button 
                class="tab tab-sm" 
                :class="{ 'tab-active': spriteType === 'shiny' }"
                @click="spriteType = 'shiny'"
              >闪光</button>
            </div>

            <img 
              :key="`${detail.id}-${spriteType}`"
              :src="getSpriteUrl(detail.id, spriteType)" 
              :alt="detail.name"
              class="w-48 h-48 object-contain mx-auto drop-shadow-xl transition-opacity duration-200"
            />

            <!-- 播放叫声 -->
            <div class="flex justify-center mt-4">
              <button class="btn btn-sm btn-outline gap-2" @click="playCry">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                叫声
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧信息区 -->
        <div class="flex-1 min-w-0">
          <!-- 基本信息 -->
          <div class="flex items-center gap-3 mb-4">
            <span class="badge badge-lg font-mono">#{{ String(detail.id).padStart(3, '0') }}</span>
            <h3 class="text-2xl font-bold capitalize">{{ detail.name }}</h3>
            <span v-if="species?.is_legendary" class="badge badge-warning">传说</span>
            <span v-if="species?.is_mythical" class="badge badge-secondary">幻兽</span>
          </div>

          <!-- 类型 -->
          <div class="flex gap-2 mb-4">
            <span 
              v-for="type in detail.types" 
              :key="type.type.name"
              class="badge badge-lg text-white"
              :style="{ backgroundColor: TYPE_COLORS[type.type.name] || '#999' }"
            >
              {{ TYPE_NAMES_ZH[type.type.name] || type.type.name }}
            </span>
          </div>

          <!-- 描述 -->
          <p v-if="description" class="text-base-content/70 mb-4 text-sm">
            {{ description }}
          </p>

          <!-- 基础数据 -->
          <div class="stats stats-vertical lg:stats-horizontal shadow mb-4 w-full">
            <div class="stat place-items-center py-2">
              <div class="stat-title text-xs">身高</div>
              <div class="stat-value text-lg">{{ (detail.height / 10).toFixed(1) }}m</div>
            </div>
            <div class="stat place-items-center py-2">
              <div class="stat-title text-xs">体重</div>
              <div class="stat-value text-lg">{{ (detail.weight / 10).toFixed(1) }}kg</div>
            </div>
            <div class="stat place-items-center py-2">
              <div class="stat-title text-xs">经验值</div>
              <div class="stat-value text-lg">{{ detail.base_experience || '-' }}</div>
            </div>
          </div>

          <!-- 能力 -->
          <div class="mb-4">
            <h4 class="font-semibold mb-2">特性</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="ability in detail.abilities" 
                :key="ability.ability.name"
                class="badge"
                :class="ability.is_hidden ? 'badge-ghost' : 'badge-primary badge-outline'"
              >
                {{ ability.ability.name.replace('-', ' ') }}
                <span v-if="ability.is_hidden" class="text-xs ml-1">(隐藏)</span>
              </span>
            </div>
          </div>

          <!-- 属性值 -->
          <div>
            <h4 class="font-semibold mb-2">种族值</h4>
            <div class="space-y-2">
              <div v-for="stat in detail.stats" :key="stat.stat.name" class="flex items-center gap-2">
                <span class="w-16 text-xs text-right">{{ STAT_NAMES_ZH[stat.stat.name] || stat.stat.name }}</span>
                <span class="w-8 text-sm font-mono text-right">{{ stat.base_stat }}</span>
                <progress 
                  class="progress w-full" 
                  :class="getStatColor(stat.base_stat)"
                  :value="stat.base_stat" 
                  max="255"
                ></progress>
              </div>
              <div class="flex items-center gap-2 pt-2 border-t">
                <span class="w-16 text-xs text-right font-semibold">总计</span>
                <span class="w-8 text-sm font-mono font-bold text-right">{{ totalStats }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-4xl mb-4">😢</div>
        <p class="text-error">{{ error }}</p>
      </div>
    </div>
    
    <!-- 点击背景关闭 -->
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { Pokemon, PokemonDetail, PokemonSpecies } from '~/types/pokemon'
import { TYPE_COLORS, TYPE_NAMES_ZH, STAT_NAMES_ZH } from '~/types/pokemon'

const props = defineProps<{
  pokemon: Pokemon | null
  isFavorite?: boolean
}>()

defineEmits<{
  toggleFavorite: [id: number]
}>()

const { fetchPokemonDetail, fetchPokemonSpecies, getSpriteUrl } = usePokemon()

const modalRef = ref<HTMLDialogElement>()
const loading = ref(false)
const error = ref<string | null>(null)
const detail = ref<PokemonDetail | null>(null)
const species = ref<PokemonSpecies | null>(null)
const spriteType = ref<'default' | 'shiny' | 'artwork'>('artwork')

// 计算属性
const totalStats = computed(() => {
  if (!detail.value) return 0
  return detail.value.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
})

const description = computed(() => {
  if (!species.value) return ''
  const entry = species.value.flavor_text_entries.find(
    e => e.language.name === 'zh-Hans' || e.language.name === 'zh-Hant'
  ) || species.value.flavor_text_entries.find(
    e => e.language.name === 'en'
  )
  return entry?.flavor_text.replace(/\n|\f/g, ' ') || ''
})

// 获取属性值颜色
const getStatColor = (value: number) => {
  if (value >= 150) return 'progress-error'
  if (value >= 100) return 'progress-warning'
  if (value >= 70) return 'progress-success'
  if (value >= 50) return 'progress-info'
  return 'progress-primary'
}

// 播放叫声
const playCry = () => {
  if (detail.value?.cries?.latest) {
    const audio = new Audio(detail.value.cries.latest)
    audio.volume = 0.3
    audio.play()
  }
}

// 打开模态框 - 接收 pokemon id 作为参数确保数据一致性
const open = async (pokemonId?: number) => {
  // 使用传入的 id 或 props 中的 id
  const id = pokemonId ?? props.pokemon?.id
  if (!id) return
  
  // 先重置状态，确保不显示旧数据
  loading.value = true
  error.value = null
  detail.value = null
  species.value = null
  spriteType.value = 'artwork'
  
  // 打开模态框
  modalRef.value?.showModal()

  try {
    const [detailData, speciesData] = await Promise.all([
      fetchPokemonDetail(id),
      fetchPokemonSpecies(id)
    ])
    detail.value = detailData
    species.value = speciesData
  } catch (e) {
    error.value = '加载失败，请重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 关闭模态框
const close = () => {
  modalRef.value?.close()
}

// 暴露方法
defineExpose({ open, close })
</script>
