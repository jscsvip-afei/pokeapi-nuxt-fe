<template>
  <div 
    class="card bg-base-100 shadow hover:shadow-lg transition-all cursor-pointer"
    @click="$emit('click')"
  >
    <div class="card-body p-4">
      <!-- 头部：名称和属性 -->
      <div class="flex items-center justify-between">
        <h3 class="card-title text-base capitalize">
          {{ getMoveName }}
        </h3>
        <span 
          class="badge text-white text-xs"
          :style="{ backgroundColor: TYPE_COLORS[move.type.name] || '#999' }"
        >
          {{ TYPE_NAMES_ZH[move.type.name] || move.type.name }}
        </span>
      </div>

      <!-- 伤害类型 -->
      <div class="flex items-center gap-2 mt-2">
        <span 
          class="badge badge-sm text-white"
          :style="{ backgroundColor: DAMAGE_CLASS_COLORS[move.damage_class.name] }"
        >
          {{ DAMAGE_CLASS_ICONS[move.damage_class.name] }} 
          {{ DAMAGE_CLASS_NAMES[move.damage_class.name] }}
        </span>
        <span class="text-xs text-base-content/60">
          #{{ String(move.id).padStart(3, '0') }}
        </span>
      </div>

      <!-- 数值 -->
      <div class="grid grid-cols-3 gap-2 mt-3">
        <div class="text-center p-2 bg-base-200 rounded">
          <div class="text-xs text-base-content/60">威力</div>
          <div class="font-bold text-sm">{{ move.power || '-' }}</div>
        </div>
        <div class="text-center p-2 bg-base-200 rounded">
          <div class="text-xs text-base-content/60">命中</div>
          <div class="font-bold text-sm">{{ move.accuracy ? `${move.accuracy}%` : '-' }}</div>
        </div>
        <div class="text-center p-2 bg-base-200 rounded">
          <div class="text-xs text-base-content/60">PP</div>
          <div class="font-bold text-sm">{{ move.pp }}</div>
        </div>
      </div>

      <!-- 效果描述 -->
      <p v-if="shortEffect" class="text-xs text-base-content/70 mt-2 line-clamp-2">
        {{ shortEffect }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Move } from '~/types/move'
import { DAMAGE_CLASS_NAMES, DAMAGE_CLASS_COLORS, DAMAGE_CLASS_ICONS } from '~/types/move'
import { TYPE_COLORS, TYPE_NAMES_ZH } from '~/types/pokemon'

const props = defineProps<{
  move: Move
}>()

defineEmits<{
  click: []
}>()

// 获取中文名称
const getMoveName = computed(() => {
  const zhName = props.move.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || props.move.name.replace(/-/g, ' ')
})

// 获取简短效果描述
const shortEffect = computed(() => {
  const entry = props.move.effect_entries?.find(e => e.language.name === 'en')
  return entry?.short_effect || ''
})
</script>
