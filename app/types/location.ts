// 地区相关类型
export interface Region {
  id: number
  name: string
  locations: Array<{ name: string; url: string }>
  main_generation: { name: string; url: string } | null
  names: Array<{ name: string; language: { name: string; url: string } }>
  pokedexes: Array<{ name: string; url: string }>
  version_groups: Array<{ name: string; url: string }>
}

// 地点
export interface Location {
  id: number
  name: string
  region: { name: string; url: string } | null
  names: Array<{ name: string; language: { name: string; url: string } }>
  game_indices: Array<{
    game_index: number
    generation: { name: string; url: string }
  }>
  areas: Array<{ name: string; url: string }>
}

// 地点区域
export interface LocationArea {
  id: number
  name: string
  game_index: number
  encounter_method_rates: Array<{
    encounter_method: { name: string; url: string }
    version_details: Array<{
      rate: number
      version: { name: string; url: string }
    }>
  }>
  location: { name: string; url: string }
  names: Array<{ name: string; language: { name: string; url: string } }>
  pokemon_encounters: Array<{
    pokemon: { name: string; url: string }
    version_details: Array<{
      version: { name: string; url: string }
      max_chance: number
      encounter_details: Array<{
        min_level: number
        max_level: number
        condition_values: Array<{ name: string; url: string }>
        chance: number
        method: { name: string; url: string }
      }>
    }>
  }>
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
  'hisui': '洗翠',
  'paldea': '帕底亚'
}

// 地区描述
export const REGION_DESCRIPTIONS: Record<string, string> = {
  'kanto': '宝可梦系列的起源之地，以东京为原型。',
  'johto': '第二世代的舞台，与关都相连。',
  'hoenn': '充满热带风情的群岛地区。',
  'sinnoh': '北方寒冷地区，有着悠久的神话历史。',
  'unova': '以纽约为原型的现代化都市地区。',
  'kalos': '以法国为原型，优雅而美丽。',
  'alola': '热带群岛，拥有独特的阿罗拉形态。',
  'galar': '以英国为原型，有极巨化现象。',
  'hisui': '古代神奥的名称，洗翠地区。',
  'paldea': '开放世界冒险的舞台。'
}

// 地区图片（使用 emoji 或颜色）
export const REGION_COLORS: Record<string, string> = {
  'kanto': '#E63946',
  'johto': '#FFB703',
  'hoenn': '#2A9D8F',
  'sinnoh': '#457B9D',
  'unova': '#6D6875',
  'kalos': '#E9C46A',
  'alola': '#F4A261',
  'galar': '#264653',
  'hisui': '#8B5CF6',
  'paldea': '#EC4899'
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

// 遭遇方式名称
export const ENCOUNTER_METHOD_NAMES: Record<string, string> = {
  'walk': '草丛/洞窟行走',
  'old-rod': '旧钓竿',
  'good-rod': '好钓竿',
  'super-rod': '超级钓竿',
  'surf': '冲浪',
  'rock-smash': '碎岩',
  'headbutt': '头槌',
  'dark-grass': '深色草丛',
  'grass-spots': '草丛晃动',
  'cave-spots': '洞窟尘埃',
  'bridge-spots': '桥上阴影',
  'super-rod-spots': '钓鱼点',
  'surf-spots': '水面波纹',
  'yellow-flowers': '黄色花丛',
  'purple-flowers': '紫色花丛',
  'red-flowers': '红色花丛',
  'rough-terrain': '崎岖地形',
  'gift': '赠送',
  'gift-egg': '赠送蛋',
  'only-one': '唯一',
  'pokeflute': '宝可梦笛',
  'squirt-bottle': '喷壶',
  'berry-tree': '树果树',
  'devon-scope': '德文透视镜',
  'feebas-tile-fishing': '丑丑鱼钓点'
}
