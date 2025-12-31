// 基础宝可梦信息（列表用）
export interface Pokemon {
  id: number
  name: string
  url: string
}

// 宝可梦类型
export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

// 宝可梦能力
export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}

// 宝可梦属性值
export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

// 宝可梦精灵图
export interface PokemonSprites {
  front_default: string
  front_shiny: string
  back_default: string
  back_shiny: string
  other?: {
    'official-artwork'?: {
      front_default: string
      front_shiny: string
    }
    dream_world?: {
      front_default: string
    }
    home?: {
      front_default: string
      front_shiny: string
    }
  }
}

// 宝可梦叫声
export interface PokemonCries {
  latest: string
  legacy: string
}

// 宝可梦详细信息
export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: PokemonType[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]
  sprites: PokemonSprites
  cries: PokemonCries
}

// 宝可梦物种信息
export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }[]
  genera: {
    genus: string
    language: {
      name: string
    }
  }[]
  evolution_chain: {
    url: string
  }
  is_legendary: boolean
  is_mythical: boolean
}

// 类型颜色映射
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

// 类型中文名映射
export const TYPE_NAMES_ZH: Record<string, string> = {
  normal: '一般',
  fire: '火',
  water: '水',
  electric: '电',
  grass: '草',
  ice: '冰',
  fighting: '格斗',
  poison: '毒',
  ground: '地面',
  flying: '飞行',
  psychic: '超能力',
  bug: '虫',
  rock: '岩石',
  ghost: '幽灵',
  dragon: '龙',
  dark: '恶',
  steel: '钢',
  fairy: '妖精',
}

// 属性中文名映射
export const STAT_NAMES_ZH: Record<string, string> = {
  hp: 'HP',
  attack: '攻击',
  defense: '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  speed: '速度',
}
