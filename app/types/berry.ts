// 树果相关类型
export interface Berry {
  id: number
  name: string
  growth_time: number
  max_harvest: number
  natural_gift_power: number
  size: number
  smoothness: number
  soil_dryness: number
  firmness: { name: string; url: string }
  flavors: Array<{
    potency: number
    flavor: { name: string; url: string }
  }>
  item: { name: string; url: string }
  natural_gift_type: { name: string; url: string }
}

// 树果硬度
export interface BerryFirmness {
  id: number
  name: string
  berries: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 树果口味
export interface BerryFlavor {
  id: number
  name: string
  berries: Array<{
    potency: number
    berry: { name: string; url: string }
  }>
  contest_type: { name: string; url: string }
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 硬度中文名
export const FIRMNESS_NAMES_ZH: Record<string, string> = {
  'very-soft': '非常软',
  'soft': '软',
  'hard': '硬',
  'very-hard': '非常硬',
  'super-hard': '超级硬'
}

// 树果中文名（部分常见树果）
export const BERRY_NAMES_ZH: Record<string, string> = {
  'cheri': '樱子果',
  'chesto': '零余果',
  'pecha': '桃桃果',
  'rawst': '莓莓果',
  'aspear': '利木果',
  'leppa': '苹野果',
  'oran': '橙橙果',
  'persim': '柿仔果',
  'lum': '木子果',
  'sitrus': '文柚果',
  'figy': '异奇果',
  'wiki': '芭亚果',
  'mago': '芒芒果',
  'aguav': '乐芭果',
  'iapapa': '芭乐果',
  'razz': '蔓莓果',
  'bluk': '蓝莓果',
  'nanab': '蕉香果',
  'wepear': '西梨果',
  'pinap': '凰梨果'
}
