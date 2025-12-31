// 招式相关类型
export interface Move {
  id: number
  name: string
  accuracy: number | null
  effect_chance: number | null
  pp: number
  priority: number
  power: number | null
  contest_combos: {
    normal: {
      use_before: Array<{ name: string; url: string }> | null
      use_after: Array<{ name: string; url: string }> | null
    } | null
    super: {
      use_before: Array<{ name: string; url: string }> | null
      use_after: Array<{ name: string; url: string }> | null
    } | null
  } | null
  contest_type: { name: string; url: string } | null
  contest_effect: { url: string } | null
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
  machines: Array<{
    machine: { url: string }
    version_group: { name: string; url: string }
  }>
  meta: {
    ailment: { name: string; url: string }
    category: { name: string; url: string }
    min_hits: number | null
    max_hits: number | null
    min_turns: number | null
    max_turns: number | null
    drain: number
    healing: number
    crit_rate: number
    ailment_chance: number
    flinch_chance: number
    stat_chance: number
  } | null
  names: Array<{ name: string; language: { name: string; url: string } }>
  past_values: Array<{
    accuracy: number | null
    effect_chance: number | null
    power: number | null
    pp: number | null
    effect_entries: Array<{
      effect: string
      short_effect: string
      language: { name: string; url: string }
    }>
    type: { name: string; url: string } | null
    version_group: { name: string; url: string }
  }>
  stat_changes: Array<{
    change: number
    stat: { name: string; url: string }
  }>
  super_contest_effect: { url: string } | null
  target: { name: string; url: string }
  type: { name: string; url: string }
  learned_by_pokemon: Array<{ name: string; url: string }>
}

// 招式分类
export interface MoveCategory {
  id: number
  name: string
  descriptions: Array<{ description: string; language: { name: string; url: string } }>
  moves: Array<{ name: string; url: string }>
}

// 招式伤害类型
export interface MoveDamageClass {
  id: number
  name: string
  descriptions: Array<{ description: string; language: { name: string; url: string } }>
  moves: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 招式目标
export interface MoveTarget {
  id: number
  name: string
  descriptions: Array<{ description: string; language: { name: string; url: string } }>
  moves: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 伤害类型名称和颜色
export const DAMAGE_CLASS_NAMES: Record<string, string> = {
  'physical': '物理',
  'special': '特殊',
  'status': '变化'
}

export const DAMAGE_CLASS_COLORS: Record<string, string> = {
  'physical': '#C92112',
  'special': '#4F5870',
  'status': '#8C888C'
}

export const DAMAGE_CLASS_ICONS: Record<string, string> = {
  'physical': '💥',
  'special': '✨',
  'status': '🔄'
}

// 招式目标名称
export const MOVE_TARGET_NAMES: Record<string, string> = {
  'specific-move': '特定招式',
  'selected-pokemon-me-first': '抢先一步的对象',
  'ally': '我方同伴',
  'users-field': '我方场地',
  'user-or-ally': '自己或同伴',
  'opponents-field': '对方场地',
  'user': '自己',
  'random-opponent': '随机对手',
  'all-other-pokemon': '所有其他宝可梦',
  'selected-pokemon': '选定的宝可梦',
  'all-opponents': '所有对手',
  'entire-field': '整个场地',
  'user-and-allies': '自己和同伴',
  'all-pokemon': '所有宝可梦',
  'all-allies': '所有同伴',
  'fainting-pokemon': '濒死的宝可梦'
}

// 招式异常状态名称
export const MOVE_AILMENT_NAMES: Record<string, string> = {
  'unknown': '未知',
  'none': '无',
  'paralysis': '麻痹',
  'sleep': '睡眠',
  'freeze': '冰冻',
  'burn': '灼伤',
  'poison': '中毒',
  'confusion': '混乱',
  'infatuation': '着迷',
  'trap': '束缚',
  'nightmare': '噩梦',
  'torment': '无理取闹',
  'disable': '定身法',
  'yawn': '哈欠',
  'heal-block': '回复封锁',
  'no-type-immunity': '无属性免疫',
  'leech-seed': '寄生种子',
  'embargo': '查封',
  'perish-song': '灭亡之歌',
  'ingrain': '扎根',
  'silence': '沉默',
  'tar-shot': '沥青射击'
}
