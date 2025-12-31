<template>
  <div 
    class="card bg-base-100 shadow hover:shadow-lg transition-all cursor-pointer group"
    @click="$emit('click')"
  >
    <div class="card-body items-center p-4">
      <!-- 道具图片 -->
      <div class="w-12 h-12 flex items-center justify-center">
        <img 
          v-if="item.sprites?.default"
          :src="item.sprites.default" 
          :alt="item.name"
          class="w-full h-full object-contain group-hover:scale-110 transition-transform"
          loading="lazy"
        />
        <span v-else class="text-3xl">📦</span>
      </div>
      
      <!-- 道具名称 -->
      <h3 class="text-sm font-medium capitalize text-center mt-2 line-clamp-2 group-hover:text-primary transition-colors">
        {{ itemName }}
      </h3>

      <!-- 价格 -->
      <div v-if="item.cost" class="badge badge-ghost badge-sm mt-1">
        💰 {{ item.cost.toLocaleString() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/types/item'

const props = defineProps<{
  item: Item
}>()

defineEmits<{
  click: []
}>()

// 获取道具名称
const itemName = computed(() => {
  const zhName = props.item.names?.find(n => 
    n.language.name === 'zh-Hans' || n.language.name === 'zh-Hant'
  )
  return zhName?.name || props.item.name.replace(/-/g, ' ')
})
</script>
