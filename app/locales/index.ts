// 多语言翻译文件

export type Language = 'zh' | 'en'

export interface Translations {
  // 通用
  common: {
    search: string
    loading: string
    loadMore: string
    noData: string
    close: string
    all: string
    favorites: string
    details: string
    total: string
    loaded: string
  }
  // 导航
  nav: {
    pokedex: string
    evolution: string
    moves: string
    items: string
    abilities: string
    natures: string
    berries: string
    regions: string
  }
  // 首页
  home: {
    title: string
    subtitle: string
    searchPlaceholder: string
    allTypes: string
    filterResults: string
    searchLabel: string
    typeLabel: string
    onlyFavorites: string
    count: string
    loadedAll: string
  }
  // 主题
  theme: {
    title: string
    light: string
    dark: string
  }
  // 宝可梦详情
  pokemon: {
    height: string
    weight: string
    baseStats: string
    abilities: string
    hiddenAbility: string
    cries: string
    play: string
    types: string
  }
  // 进化
  evolution: {
    title: string
    subtitle: string
    searchById: string
    chains: string
  }
  // 招式
  moves: {
    title: string
    subtitle: string
    power: string
    accuracy: string
    pp: string
    damageClass: string
    effect: string
    physical: string
    special: string
    status: string
  }
  // 道具
  items: {
    title: string
    subtitle: string
    cost: string
    category: string
    effect: string
  }
  // 特性
  abilities: {
    title: string
    subtitle: string
    generation: string
    pokemonWith: string
    hidden: string
  }
  // 性格
  natures: {
    title: string
    subtitle: string
    info: string
    increased: string
    decreased: string
    likesFlavor: string
    hatesFlavor: string
    neutral: string
    matrix: string
    matrixDesc: string
  }
  // 树果
  berries: {
    title: string
    subtitle: string
    size: string
    firmness: string
    growthTime: string
    maxHarvest: string
    naturalGift: string
    flavor: string
    smoothness: string
    soilDryness: string
  }
  // 地区
  regions: {
    title: string
    subtitle: string
    locations: string
    generation: string
    explore: string
    pokedexes: string
    gameVersions: string
  }
}

export const translations: Record<Language, Translations> = {
  zh: {
    common: {
      search: '搜索',
      loading: '加载中...',
      loadMore: '加载更多',
      noData: '暂无数据',
      close: '关闭',
      all: '全部',
      favorites: '收藏',
      details: '详情',
      total: '总数',
      loaded: '已加载'
    },
    nav: {
      pokedex: '图鉴',
      evolution: '进化',
      moves: '招式',
      items: '道具',
      abilities: '特性',
      natures: '性格',
      berries: '树果',
      regions: '地区'
    },
    home: {
      title: '宝可梦图鉴',
      subtitle: '探索神奇的宝可梦世界，查看详细属性和能力',
      searchPlaceholder: '搜索宝可梦名称...',
      allTypes: '全部类型',
      filterResults: '筛选结果',
      searchLabel: '搜索',
      typeLabel: '类型',
      onlyFavorites: '仅收藏',
      count: '共 {count} 只',
      loadedAll: '已加载全部 {count} 只宝可梦'
    },
    theme: {
      title: '主题',
      light: '浅色',
      dark: '深色'
    },
    pokemon: {
      height: '身高',
      weight: '体重',
      baseStats: '基础属性',
      abilities: '特性',
      hiddenAbility: '隐藏特性',
      cries: '叫声',
      play: '播放',
      types: '属性'
    },
    evolution: {
      title: '进化链',
      subtitle: '探索宝可梦的进化路线',
      searchById: '搜索宝可梦ID...',
      chains: '进化链'
    },
    moves: {
      title: '招式图鉴',
      subtitle: '探索宝可梦招式，了解它们的威力和效果',
      power: '威力',
      accuracy: '命中',
      pp: 'PP',
      damageClass: '伤害类型',
      effect: '效果',
      physical: '物理',
      special: '特殊',
      status: '变化'
    },
    items: {
      title: '道具图鉴',
      subtitle: '浏览所有宝可梦道具，了解效果和用途',
      cost: '价格',
      category: '分类',
      effect: '效果'
    },
    abilities: {
      title: '特性图鉴',
      subtitle: '探索宝可梦特性，了解它们的效果',
      generation: '世代',
      pokemonWith: '拥有此特性的宝可梦',
      hidden: '隐藏'
    },
    natures: {
      title: '性格图鉴',
      subtitle: '了解25种性格对宝可梦能力值的影响',
      info: '性格会使一项能力值提升10%，另一项降低10%。部分性格为中性，不影响能力值。',
      increased: '提升',
      decreased: '降低',
      likesFlavor: '喜欢口味',
      hatesFlavor: '讨厌口味',
      neutral: '中性',
      matrix: '性格矩阵',
      matrixDesc: '行为降低的能力值，列为提升的能力值'
    },
    berries: {
      title: '树果图鉴',
      subtitle: '探索各种树果，了解它们的属性和用途',
      size: '大小',
      firmness: '硬度',
      growthTime: '生长时间',
      maxHarvest: '最大收获',
      naturalGift: '自然礼物',
      flavor: '口味',
      smoothness: '光滑度',
      soilDryness: '土壤干燥度'
    },
    regions: {
      title: '地区探索',
      subtitle: '探索宝可梦世界的各个地区',
      locations: '地点',
      generation: '世代',
      explore: '探索',
      pokedexes: '图鉴',
      gameVersions: '相关游戏版本'
    }
  },
  en: {
    common: {
      search: 'Search',
      loading: 'Loading...',
      loadMore: 'Load More',
      noData: 'No Data',
      close: 'Close',
      all: 'All',
      favorites: 'Favorites',
      details: 'Details',
      total: 'Total',
      loaded: 'Loaded'
    },
    nav: {
      pokedex: 'Pokédex',
      evolution: 'Evolution',
      moves: 'Moves',
      items: 'Items',
      abilities: 'Abilities',
      natures: 'Natures',
      berries: 'Berries',
      regions: 'Regions'
    },
    home: {
      title: 'Pokédex',
      subtitle: 'Explore the world of Pokémon, view detailed stats and abilities',
      searchPlaceholder: 'Search Pokémon...',
      allTypes: 'All Types',
      filterResults: 'Filter Results',
      searchLabel: 'Search',
      typeLabel: 'Type',
      onlyFavorites: 'Favorites Only',
      count: '{count} Pokémon',
      loadedAll: 'All {count} Pokémon loaded'
    },
    theme: {
      title: 'Theme',
      light: 'Light',
      dark: 'Dark'
    },
    pokemon: {
      height: 'Height',
      weight: 'Weight',
      baseStats: 'Base Stats',
      abilities: 'Abilities',
      hiddenAbility: 'Hidden Ability',
      cries: 'Cries',
      play: 'Play',
      types: 'Types'
    },
    evolution: {
      title: 'Evolution Chains',
      subtitle: 'Explore Pokémon evolution paths',
      searchById: 'Search by Pokémon ID...',
      chains: 'Chains'
    },
    moves: {
      title: 'Move Database',
      subtitle: 'Explore Pokémon moves and their effects',
      power: 'Power',
      accuracy: 'Accuracy',
      pp: 'PP',
      damageClass: 'Damage Class',
      effect: 'Effect',
      physical: 'Physical',
      special: 'Special',
      status: 'Status'
    },
    items: {
      title: 'Item Database',
      subtitle: 'Browse all Pokémon items and their effects',
      cost: 'Cost',
      category: 'Category',
      effect: 'Effect'
    },
    abilities: {
      title: 'Ability Database',
      subtitle: 'Explore Pokémon abilities and their effects',
      generation: 'Generation',
      pokemonWith: 'Pokémon with this ability',
      hidden: 'Hidden'
    },
    natures: {
      title: 'Nature Guide',
      subtitle: 'Learn how 25 natures affect Pokémon stats',
      info: 'Natures increase one stat by 10% and decrease another by 10%. Some natures are neutral.',
      increased: 'Increased',
      decreased: 'Decreased',
      likesFlavor: 'Likes',
      hatesFlavor: 'Hates',
      neutral: 'Neutral',
      matrix: 'Nature Matrix',
      matrixDesc: 'Rows show decreased stat, columns show increased stat'
    },
    berries: {
      title: 'Berry Database',
      subtitle: 'Explore berries and their properties',
      size: 'Size',
      firmness: 'Firmness',
      growthTime: 'Growth Time',
      maxHarvest: 'Max Harvest',
      naturalGift: 'Natural Gift',
      flavor: 'Flavor',
      smoothness: 'Smoothness',
      soilDryness: 'Soil Dryness'
    },
    regions: {
      title: 'Region Explorer',
      subtitle: 'Explore regions of the Pokémon world',
      locations: 'Locations',
      generation: 'Generation',
      explore: 'Explore',
      pokedexes: 'Pokédexes',
      gameVersions: 'Game Versions'
    }
  }
}
