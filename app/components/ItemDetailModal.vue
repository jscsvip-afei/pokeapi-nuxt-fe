<template>
  <dialog ref="modal" class="modal" @click.self="close">
    <div class="modal-box max-w-lg">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
      
      <div v-if="loading" class="flex justify-center items-center min-h-[300px]">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <template v-else-if="item">
        <!-- 头部 -->
        <div class="flex flex-col items-center gap-4 mb-6">
          <div class="w-20 h-20 flex items-center justify-center bg-base-200 rounded-full">
            <img 
              v-if="item.sprites?.default"
              :src="item.sprites.default" 
              :alt="item.name"
              class="w-16 h-16 object-contain"
            />
            <span v-else class="text-5xl">📦</span>
          </div>
          
          <div class="text-center">
            <h2 class="text-xl font-bold capitalize">{{ itemName }}</h2>
            <p class="text-sm text-base-content/60">#{{ item.id }}</p>
          </div>
        </div>

        <!-- 分类和口袋 -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <div class="badge badge-primary">{{ categoryName }}</div>
          <div v-if="pocketName" class="badge badge-outline">{{ pocketName }}</div>
        </div>

        <!-- 价格 -->
        <div v-if="item.cost" class="flex justify-center mb-4">
          <div class="stat place-items-center bg-base-200 rounded-lg p-3">
            <div class="stat-title text-xs">价格</div>
            <div class="stat-value text-lg text-warning">💰 {{ item.cost.toLocaleString() }}</div>
            <div class="stat-desc text-xs">宝可梦币</div>
          </div>
        </div>

        <!-- 效果描述 -->
        <div class="mb-4">
          <h3 class="font-semibold text-sm mb-2">效果</h3>
          <p class="text-sm text-base-content/80 leading-relaxed">
            {{ effectText || '暂无效果描述' }}
          </p>
        </div>

        <!-- 简短效果 -->
        <div v-if="shortEffectText" class="mb-4">
          <h3 class="font-semibold text-sm mb-2">简短效果</h3>
          <p class="text-sm text-base-content/60">
            {{ shortEffectText }}
          </p>
        </div>

        <!-- 属性列表 -->
        <div v-if="item.attributes?.length" class="mb-4">
          <h3 class="font-semibold text-sm mb-2">属性</h3>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="attr in item.attributes" 
              :key="attr.name"
              class="badge badge-ghost badge-sm capitalize"
            >
              {{ attr.name.replace(/-/g, ' ') }}
            </span>
          </div>
        </div>

        <!-- 游戏描述 -->
        <div v-if="flavorText" class="mb-4">
          <h3 class="font-semibold text-sm mb-2">游戏描述</h3>
          <div class="bg-base-200 rounded-lg p-3">
            <p class="text-sm italic text-base-content/70">
              "{{ flavorText }}"
            </p>
          </div>
        </div>

        <!-- 持有此道具的宝可梦 -->
        <div v-if="item.held_by_pokemon?.length">
          <h3 class="font-semibold text-sm mb-2">携带此道具的宝可梦</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="p in item.held_by_pokemon.slice(0, 10)" 
              :key="p.pokemon.name"
              class="badge badge-outline badge-sm capitalize"
            >
              {{ p.pokemon.name.replace(/-/g, ' ') }}
            </span>
            <span 
              v-if="item.held_by_pokemon.length > 10"
              class="badge badge-ghost badge-sm"
            >
              +{{ item.held_by_pokemon.length - 10 }} 更多
            </span>
          </div>
        </div>

        <!-- 所属游戏 -->
        <div v-if="item.game_indices?.length" class="mt-4">
          <h3 class="font-semibold text-sm mb-2">出现游戏</h3>
          <div class="text-xs text-base-content/60">
            出现于 {{ item.game_indices.length }} 个游戏版本
          </div>
        </div>
      </template>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { Item } from '~/types/item'
import { usePokeData } from '~/composables/usePokeData'

const modal = ref<HTMLDialogElement | null>(null)
const item = ref<Item | null>(null)
const loading = ref(false)

const { fetchItem } = usePokeData()

// 获取道具名称
const itemName = computed(() => {
  if (!item.value) return ''
  const zhName = item.value.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || item.value.name.replace(/-/g, ' ')
})

// 获取分类名称
const categoryName = computed(() => {
  return item.value?.category?.name?.replace(/-/g, ' ') || '未知分类'
})

// 获取口袋名称 (需要另外获取category详情才有pocket)
const pocketName = computed(() => {
  return ''
})

// 获取效果文本
const effectText = computed(() => {
  if (!item.value?.effect_entries?.length) return ''
  const entry = item.value.effect_entries.find(e => e.language.name === 'en')
  return entry?.effect || item.value.effect_entries[0]?.effect || ''
})

// 获取简短效果文本
const shortEffectText = computed(() => {
  if (!item.value?.effect_entries?.length) return ''
  const entry = item.value.effect_entries.find(e => e.language.name === 'en')
  return entry?.short_effect || ''
})

// 获取游戏描述
const flavorText = computed(() => {
  if (!item.value?.flavor_text_entries?.length) return ''
  const entry = item.value.flavor_text_entries.find(e => e.language.name === 'en')
  return entry?.text?.replace(/\n/g, ' ') || ''
})

// 打开弹窗
const open = async (itemId: number | string) => {
  modal.value?.showModal()
  loading.value = true
  item.value = null
  
  try {
    item.value = await fetchItem(itemId)
  } catch (error) {
    console.error('Failed to fetch item:', error)
  } finally {
    loading.value = false
  }
}

// 关闭弹窗
const close = () => {
  modal.value?.close()
}

defineExpose({
  open,
  close
})
</script>
