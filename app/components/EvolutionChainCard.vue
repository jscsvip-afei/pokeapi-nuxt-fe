<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
    <div class="card-body">
      <!-- 标题 -->
      <h2 class="card-title text-sm text-base-content/60">
        进化链 #{{ chain.id }}
        <span v-if="isBabyChain" class="badge badge-secondary badge-sm">有Baby</span>
      </h2>

      <!-- 进化链展示 -->
      <div class="flex items-center justify-center gap-2 flex-wrap py-4">
        <template v-for="(stage, stageIndex) in evolutionStages" :key="stageIndex">
          <!-- 进化阶段 -->
          <div class="flex flex-col gap-2">
            <div 
              v-for="pokemon in stage" 
              :key="pokemon.name"
              class="flex flex-col items-center group cursor-pointer"
              @click="goToPokemon(pokemon.id)"
            >
              <!-- 宝可梦图片 -->
              <div class="avatar">
                <div class="w-20 h-20 rounded-full bg-base-200 ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-secondary transition-all">
                  <img 
                    :src="getPokemonSprite(pokemon.id, 'artwork')" 
                    :alt="pokemon.name"
                    class="object-contain p-2"
                    loading="lazy"
                  />
                </div>
              </div>
              
              <!-- 宝可梦名称 -->
              <span class="text-sm font-medium capitalize mt-2 group-hover:text-primary transition-colors">
                {{ pokemon.name }}
              </span>
              <span class="text-xs text-base-content/50">#{{ String(pokemon.id).padStart(3, '0') }}</span>
              
              <!-- 进化条件 -->
              <div v-if="pokemon.evolutionDetails.length > 0" class="mt-1">
                <div 
                  v-for="(detail, idx) in pokemon.evolutionDetails" 
                  :key="idx"
                  class="badge badge-outline badge-xs"
                  :title="getEvolutionDetailText(detail)"
                >
                  {{ getEvolutionTrigger(detail) }}
                </div>
              </div>
              
              <!-- Baby 标记 -->
              <span v-if="pokemon.isBaby" class="badge badge-secondary badge-xs mt-1">Baby</span>
            </div>
          </div>

          <!-- 箭头 -->
          <div 
            v-if="stageIndex < evolutionStages.length - 1" 
            class="text-2xl text-base-content/30"
          >
            →
          </div>
        </template>
      </div>

      <!-- 无进化 -->
      <div v-if="evolutionStages.length === 1 && evolutionStages[0]?.length === 1" class="text-center">
        <span class="badge badge-ghost">无进化形态</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EvolutionChain, ChainLink, EvolutionDetail } from '~/types/evolution'
import { EVOLUTION_TRIGGER_NAMES } from '~/types/evolution'

const props = defineProps<{
  chain: EvolutionChain
}>()

const { getPokemonSprite, getSpeciesIdFromUrl } = useEvolution()
const router = useRouter()

interface PokemonStage {
  id: number
  name: string
  isBaby: boolean
  evolutionDetails: EvolutionDetail[]
}

// 是否有Baby
const isBabyChain = computed(() => props.chain.chain.is_baby)

// 解析进化阶段
const evolutionStages = computed(() => {
  const stages: PokemonStage[][] = []
  
  const parseChain = (link: ChainLink, stageIndex: number) => {
    if (!stages[stageIndex]) {
      stages[stageIndex] = []
    }
    
    stages[stageIndex].push({
      id: getSpeciesIdFromUrl(link.species.url),
      name: link.species.name,
      isBaby: link.is_baby,
      evolutionDetails: link.evolution_details
    })
    
    for (const evolve of link.evolves_to) {
      parseChain(evolve, stageIndex + 1)
    }
  }
  
  parseChain(props.chain.chain, 0)
  return stages
})

// 获取进化触发方式
const getEvolutionTrigger = (detail: EvolutionDetail): string => {
  const trigger = EVOLUTION_TRIGGER_NAMES[detail.trigger.name] || detail.trigger.name
  
  if (detail.min_level) {
    return `Lv.${detail.min_level}`
  }
  if (detail.item) {
    return detail.item.name.replace(/-/g, ' ')
  }
  if (detail.min_happiness) {
    return `亲密${detail.min_happiness}`
  }
  if (detail.held_item) {
    return `携带${detail.held_item.name.replace(/-/g, ' ')}`
  }
  if (detail.trade_species) {
    return `与${detail.trade_species.name}交换`
  }
  if (detail.known_move) {
    return `学会${detail.known_move.name.replace(/-/g, ' ')}`
  }
  if (detail.time_of_day) {
    return detail.time_of_day === 'day' ? '白天' : '夜晚'
  }
  
  return trigger
}

// 获取详细进化条件文本
const getEvolutionDetailText = (detail: EvolutionDetail): string => {
  const parts: string[] = []
  
  if (detail.trigger) {
    parts.push(`触发: ${EVOLUTION_TRIGGER_NAMES[detail.trigger.name] || detail.trigger.name}`)
  }
  if (detail.min_level) {
    parts.push(`等级: ${detail.min_level}`)
  }
  if (detail.item) {
    parts.push(`道具: ${detail.item.name}`)
  }
  if (detail.min_happiness) {
    parts.push(`亲密度: ${detail.min_happiness}`)
  }
  if (detail.held_item) {
    parts.push(`携带: ${detail.held_item.name}`)
  }
  if (detail.time_of_day) {
    parts.push(`时间: ${detail.time_of_day === 'day' ? '白天' : '夜晚'}`)
  }
  if (detail.location) {
    parts.push(`地点: ${detail.location.name}`)
  }
  if (detail.known_move) {
    parts.push(`招式: ${detail.known_move.name}`)
  }
  if (detail.known_move_type) {
    parts.push(`招式类型: ${detail.known_move_type.name}`)
  }
  if (detail.gender !== null) {
    parts.push(`性别: ${detail.gender === 1 ? '♀' : '♂'}`)
  }
  if (detail.needs_overworld_rain) {
    parts.push('需要下雨')
  }
  if (detail.turn_upside_down) {
    parts.push('倒转3DS')
  }
  
  return parts.join('\n') || '无特殊条件'
}

// 跳转到宝可梦详情
const goToPokemon = (id: number) => {
  router.push(`/?pokemon=${id}`)
}
</script>
