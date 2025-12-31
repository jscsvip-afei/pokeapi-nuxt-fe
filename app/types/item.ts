// 道具相关类型
export interface Item {
  id: number
  name: string
  cost: number
  fling_power: number | null
  fling_effect: { name: string; url: string } | null
  attributes: Array<{ name: string; url: string }>
  category: { name: string; url: string }
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: { name: string; url: string }
  }>
  flavor_text_entries: Array<{
    text: string
    language: { name: string; url: string }
    version_group: { name: string; url: string }
  }>
  game_indices: Array<{
    game_index: number
    generation: { name: string; url: string }
  }>
  names: Array<{ name: string; language: { name: string; url: string } }>
  sprites: {
    default: string | null
  }
  held_by_pokemon: Array<{
    pokemon: { name: string; url: string }
    version_details: Array<{
      rarity: number
      version: { name: string; url: string }
    }>
  }>
  baby_trigger_for: { url: string } | null
}

// 道具分类
export interface ItemCategory {
  id: number
  name: string
  items: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
  pocket: { name: string; url: string }
}

// 道具口袋
export interface ItemPocket {
  id: number
  name: string
  categories: Array<{ name: string; url: string }>
  names: Array<{ name: string; language: { name: string; url: string } }>
}

// 道具分类中文名
export const ITEM_CATEGORY_NAMES: Record<string, string> = {
  'stat-boosts': '能力提升',
  'effort-drop': '努力值降低',
  'medicine': '药品',
  'other': '其他',
  'in-a-pinch': '危机时刻',
  'picky-healing': '挑剔回复',
  'type-protection': '属性防护',
  'baking-only': '仅限烘焙',
  'collectibles': '收藏品',
  'evolution': '进化',
  'spelunking': '洞穴探险',
  'held-items': '携带道具',
  'choice': '讲究系列',
  'effort-training': '努力值训练',
  'bad-held-items': '负面携带',
  'training': '训练',
  'plates': '石板',
  'species-specific': '特定种类',
  'type-enhancement': '属性强化',
  'event-items': '活动道具',
  'gameplay': '游戏道具',
  'plot-advancement': '剧情推进',
  'unused': '未使用',
  'loot': '战利品',
  'all-mail': '所有邮件',
  'vitamins': '营养品',
  'healing': '回复',
  'pp-recovery': 'PP回复',
  'revival': '复活',
  'status-cures': '状态治疗',
  'mulch': '覆盖物',
  'special-balls': '特殊球',
  'standard-balls': '标准球',
  'dex-completion': '图鉴完成',
  'scarves': '围巾',
  'all-machines': '所有技能机',
  'flutes': '笛子',
  'apricorn-balls': '球果球',
  'apricorn-box': '球果盒',
  'data-cards': '数据卡',
  'jewels': '宝石',
  'miracle-shooter': '奇迹射手',
  'mega-stones': '超级石',
  'memories': '记忆碟',
  'z-crystals': 'Z纯晶',
  'species-candies': '种类糖果',
  'catching-bonus': '捕获加成',
  'dynamax-crystals': '极巨结晶',
  'nature-mints': '性格薄荷',
  'curry-ingredients': '咖喱食材',
  'tera-shard': '太晶碎片',
  'sandwich-ingredients': '三明治食材',
  'tm-materials': '招式学习器材料',
  'picnic': '野餐'
}

// 道具口袋中文名
export const ITEM_POCKET_NAMES: Record<string, string> = {
  'misc': '杂物',
  'medicine': '药品',
  'pokeballs': '精灵球',
  'machines': '技能机',
  'berries': '树果',
  'mail': '邮件',
  'battle': '战斗',
  'key': '重要物品',
  'ingredients': '食材'
}
