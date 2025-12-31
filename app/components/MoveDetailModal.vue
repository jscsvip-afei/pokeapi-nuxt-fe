<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box sm:max-w-2xl">
      <!-- 关闭按钮 -->
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <template v-if="move">
        <!-- 头部 -->
        <div class="flex items-center gap-4 mb-6">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base-content/50 font-mono">#{{ String(move.id).padStart(3, '0') }}</span>
              <h3 class="text-2xl font-bold capitalize">{{ moveName }}</h3>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <span 
                class="badge badge-lg text-white"
                :style="{ backgroundColor: TYPE_COLORS[move.type.name] || '#999' }"
              >
                {{ TYPE_NAMES_ZH[move.type.name] || move.type.name }}
              </span>
              <span 
                class="badge badge-lg text-white"
                :style="{ backgroundColor: DAMAGE_CLASS_COLORS[move.damage_class.name] }"
              >
                {{ DAMAGE_CLASS_ICONS[move.damage_class.name] }} 
                {{ DAMAGE_CLASS_NAMES[move.damage_class.name] }}
              </span>
            </div>
          </div>
        </div>

        <!-- 数值统计 -->
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
          <div class="stat place-items-center">
            <div class="stat-title">威力</div>
            <div class="stat-value text-lg">{{ move.power || '-' }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">命中率</div>
            <div class="stat-value text-lg">{{ move.accuracy ? `${move.accuracy}%` : '-' }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">PP</div>
            <div class="stat-value text-lg">{{ move.pp }}</div>
          </div>
          <div class="stat place-items-center">
            <div class="stat-title">优先度</div>
            <div class="stat-value text-lg" :class="{ 'text-success': move.priority > 0, 'text-error': move.priority < 0 }">
              {{ move.priority > 0 ? '+' : '' }}{{ move.priority }}
            </div>
          </div>
        </div>

        <!-- 效果描述 -->
        <div class="mb-6">
          <h4 class="font-semibold mb-2">效果</h4>
          <p class="text-base-content/80 text-sm">
            {{ moveEffect }}
          </p>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">目标</div>
            <div class="text-sm font-medium">{{ MOVE_TARGET_NAMES[move.target.name] || move.target.name }}</div>
          </div>
          <div class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">世代</div>
            <div class="text-sm font-medium">{{ GENERATION_NAMES[move.generation.name] || move.generation.name }}</div>
          </div>
          <div v-if="move.meta?.ailment && move.meta.ailment.name !== 'none'" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">异常状态</div>
            <div class="text-sm font-medium">
              {{ MOVE_AILMENT_NAMES[move.meta.ailment.name] || move.meta.ailment.name }}
              <span v-if="move.meta.ailment_chance" class="text-base-content/60">({{ move.meta.ailment_chance }}%)</span>
            </div>
          </div>
          <div v-if="move.meta?.flinch_chance" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">畏缩几率</div>
            <div class="text-sm font-medium">{{ move.meta.flinch_chance }}%</div>
          </div>
          <div v-if="move.meta?.crit_rate" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">暴击率加成</div>
            <div class="text-sm font-medium">+{{ move.meta.crit_rate }}</div>
          </div>
          <div v-if="move.meta?.drain" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">{{ move.meta.drain > 0 ? '吸收' : '反伤' }}</div>
            <div class="text-sm font-medium">{{ Math.abs(move.meta.drain) }}%</div>
          </div>
          <div v-if="move.meta?.healing" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">回复</div>
            <div class="text-sm font-medium">{{ move.meta.healing }}%</div>
          </div>
          <div v-if="move.meta?.min_hits && move.meta?.max_hits" class="p-3 bg-base-200 rounded-lg">
            <div class="text-xs text-base-content/60 mb-1">攻击次数</div>
            <div class="text-sm font-medium">{{ move.meta.min_hits }}-{{ move.meta.max_hits }} 次</div>
          </div>
        </div>

        <!-- 能力变化 -->
        <div v-if="move.stat_changes?.length" class="mb-6">
          <h4 class="font-semibold mb-2">能力变化</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="stat in move.stat_changes" 
              :key="stat.stat.name"
              class="badge"
              :class="stat.change > 0 ? 'badge-success' : 'badge-error'"
            >
              {{ STAT_NAMES_ZH[stat.stat.name] || stat.stat.name }}
              {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}
            </span>
          </div>
        </div>

        <!-- 可学会的宝可梦 -->
        <div v-if="move.learned_by_pokemon?.length">
          <h4 class="font-semibold mb-2">
            可学会此招式的宝可梦 
            <span class="badge badge-sm">{{ move.learned_by_pokemon.length }}</span>
          </h4>
          <div class="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            <span 
              v-for="pokemon in move.learned_by_pokemon.slice(0, 30)" 
              :key="pokemon.name"
              class="badge badge-ghost badge-sm capitalize"
            >
              {{ pokemon.name }}
            </span>
            <span v-if="move.learned_by_pokemon.length > 30" class="badge badge-ghost badge-sm">
              +{{ move.learned_by_pokemon.length - 30 }} 更多
            </span>
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
import type { Move } from '~/types/move'
import { DAMAGE_CLASS_NAMES, DAMAGE_CLASS_COLORS, DAMAGE_CLASS_ICONS, MOVE_TARGET_NAMES, MOVE_AILMENT_NAMES } from '~/types/move'
import { TYPE_COLORS, TYPE_NAMES_ZH, STAT_NAMES_ZH } from '~/types/pokemon'
import { GENERATION_NAMES } from '~/types/location'

const props = defineProps<{
  move: Move | null
}>()

const modalRef = ref<HTMLDialogElement>()

// 获取中文名称
const moveName = computed(() => {
  if (!props.move) return ''
  const zhName = props.move.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || props.move.name.replace(/-/g, ' ')
})

// 获取效果描述
const moveEffect = computed(() => {
  if (!props.move) return ''
  const entry = props.move.effect_entries?.find(e => e.language.name === 'en')
  return entry?.effect?.replace(/\$effect_chance/g, String(props.move.effect_chance || 0)) || '无描述'
})

// 打开
const open = () => {
  modalRef.value?.showModal()
}

// 关闭
const close = () => {
  modalRef.value?.close()
}

defineExpose({ open, close })
</script>
