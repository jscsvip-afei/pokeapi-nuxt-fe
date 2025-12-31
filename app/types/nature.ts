// 性格相关类型
export interface Nature {
  id: number
  name: string
  decreased_stat: { name: string; url: string } | null
  increased_stat: { name: string; url: string } | null
  hates_flavor: { name: string; url: string } | null
  likes_flavor: { name: string; url: string } | null
  pokeathlon_stat_changes: Array<{
    max_change: number
    pokeathlon_stat: { name: string; url: string }
  }>
  move_battle_style_preferences: Array<{
    low_hp_preference: number
    high_hp_preference: number
    move_battle_style: { name: string; url: string }
  }>
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 能力值中文名
export const STAT_NAMES_ZH: Record<string, string> = {
  'hp': 'HP',
  'attack': '攻击',
  'defense': '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  'speed': '速度'
}

// 口味中文名
export const FLAVOR_NAMES_ZH: Record<string, string> = {
  'spicy': '辣',
  'dry': '涩',
  'sweet': '甜',
  'bitter': '苦',
  'sour': '酸'
}

// 性格中文名映射
export const NATURE_NAMES_ZH: Record<string, string> = {
  'hardy': '勤奋',
  'lonely': '怕寂寞',
  'brave': '勇敢',
  'adamant': '固执',
  'naughty': '顽皮',
  'bold': '大胆',
  'docile': '坦率',
  'relaxed': '悠闲',
  'impish': '淘气',
  'lax': '乐天',
  'timid': '胆小',
  'hasty': '急躁',
  'serious': '认真',
  'jolly': '爽朗',
  'naive': '天真',
  'modest': '内敛',
  'mild': '慢吞吞',
  'quiet': '冷静',
  'bashful': '害羞',
  'rash': '马虎',
  'calm': '温和',
  'gentle': '温顺',
  'sassy': '自大',
  'careful': '慎重',
  'quirky': '浮躁'
}
