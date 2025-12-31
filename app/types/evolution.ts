// 进化链相关类型定义

// 进化触发方式
export interface EvolutionTrigger {
  name: string
  url: string
}

// 进化条件详情
export interface EvolutionDetail {
  gender: number | null
  held_item: { name: string; url: string } | null
  item: { name: string; url: string } | null
  known_move: { name: string; url: string } | null
  known_move_type: { name: string; url: string } | null
  location: { name: string; url: string } | null
  min_affection: number | null
  min_beauty: number | null
  min_happiness: number | null
  min_level: number | null
  needs_overworld_rain: boolean
  party_species: { name: string; url: string } | null
  party_type: { name: string; url: string } | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: { name: string; url: string } | null
  trigger: EvolutionTrigger
  turn_upside_down: boolean
}

// 进化链节点
export interface ChainLink {
  is_baby: boolean
  species: {
    name: string
    url: string
  }
  evolution_details: EvolutionDetail[]
  evolves_to: ChainLink[]
}

// 进化链
export interface EvolutionChain {
  id: number
  baby_trigger_item: { name: string; url: string } | null
  chain: ChainLink
}

// 地区
export interface Region {
  id: number
  name: string
  locations: Array<{ name: string; url: string }>
  main_generation: { name: string; url: string }
  names: Array<{ name: string; language: { name: string; url: string } }>
  pokedexes: Array<{ name: string; url: string }>
  version_groups: Array<{ name: string; url: string }>
}

// 世代
export interface Generation {
  id: number
  name: string
  abilities: Array<{ name: string; url: string }>
  main_region: { name: string; url: string }
  moves: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
  pokemon_species: Array<{ name: string; url: string }>
  types: Array<{ name: string; url: string }>
  version_groups: Array<{ name: string; url: string }>
}

// 招式
export interface Move {
  id: number
  name: string
  accuracy: number | null
  effect_chance: number | null
  pp: number
  priority: number
  power: number | null
  damage_class: { name: string; url: string }
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: { name: string; url: string }
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string; url: string }
    version_group: { name: string; url: string }
  }>
  generation: { name: string; url: string }
  names: Array<{ name: string; language: { name: string; url: string } }>
  type: { name: string; url: string }
  learned_by_pokemon: Array<{ name: string; url: string }>
}

// 世代名称映射
export const GENERATION_NAMES: Record<string, string> = {
  'generation-i': '第一世代',
  'generation-ii': '第二世代',
  'generation-iii': '第三世代',
  'generation-iv': '第四世代',
  'generation-v': '第五世代',
  'generation-vi': '第六世代',
  'generation-vii': '第七世代',
  'generation-viii': '第八世代',
  'generation-ix': '第九世代'
}

// 地区名称映射
export const REGION_NAMES: Record<string, string> = {
  'kanto': '关都',
  'johto': '城都',
  'hoenn': '丰缘',
  'sinnoh': '神奥',
  'unova': '合众',
  'kalos': '卡洛斯',
  'alola': '阿罗拉',
  'galar': '伽勒尔',
  'paldea': '帕底亚'
}

// 进化触发条件名称
export const EVOLUTION_TRIGGER_NAMES: Record<string, string> = {
  'level-up': '升级',
  'trade': '交换',
  'use-item': '使用道具',
  'shed': '脱壳',
  'spin': '旋转',
  'tower-of-darkness': '黑暗之塔',
  'tower-of-waters': '水之塔',
  'three-critical-hits': '三次暴击',
  'take-damage': '受到伤害',
  'other': '其他',
  'agile-style-move': '速攻招式',
  'strong-style-move': '刚猛招式',
  'recoil-damage': '反伤'
}

// 伤害类型名称
export const DAMAGE_CLASS_NAMES: Record<string, string> = {
  'physical': '物理',
  'special': '特殊',
  'status': '变化'
}

// 伤害类型颜色
export const DAMAGE_CLASS_COLORS: Record<string, string> = {
  'physical': '#C92112',
  'special': '#4F5870',
  'status': '#8C888C'
}
