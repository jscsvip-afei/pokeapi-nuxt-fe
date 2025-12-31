import type { Item, ItemCategory, ItemPocket } from '~/types/item'
import type { Move, MoveCategory, MoveDamageClass } from '~/types/move'
import type { Region, Location, LocationArea } from '~/types/location'

const API_BASE = 'https://pokeapi.co/api/v2'

export const usePokeData = () => {
  // 缓存
  const itemCache = useState<Map<string, Item>>('item-cache', () => new Map())
  const moveCache = useState<Map<string, Move>>('move-cache', () => new Map())
  const regionCache = useState<Map<string, Region>>('region-cache', () => new Map())
  const locationCache = useState<Map<string, Location>>('location-cache', () => new Map())

  // ========== 道具相关 ==========
  
  // 获取道具列表
  const fetchItems = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/item?limit=${limit}&offset=${offset}`
    )
    return { items: data.results, total: data.count }
  }

  // 获取道具详情
  const fetchItem = async (nameOrId: string | number): Promise<Item> => {
    const key = String(nameOrId)
    if (itemCache.value.has(key)) {
      return itemCache.value.get(key)!
    }
    const data = await $fetch<Item>(`${API_BASE}/item/${nameOrId}`)
    itemCache.value.set(key, data)
    itemCache.value.set(String(data.id), data)
    return data
  }

  // 获取道具分类列表
  const fetchItemCategories = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/item-category`
    )
    return data.results
  }

  // 获取道具分类详情
  const fetchItemCategory = async (name: string): Promise<ItemCategory> => {
    return await $fetch<ItemCategory>(`${API_BASE}/item-category/${name}`)
  }

  // 获取道具口袋列表
  const fetchItemPockets = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/item-pocket`
    )
    return data.results
  }

  // 获取道具图片
  const getItemSprite = (name: string): string => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`
  }

  // ========== 招式相关 ==========

  // 获取招式列表
  const fetchMoves = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/move?limit=${limit}&offset=${offset}`
    )
    return { moves: data.results, total: data.count }
  }

  // 获取招式详情
  const fetchMove = async (nameOrId: string | number): Promise<Move> => {
    const key = String(nameOrId)
    if (moveCache.value.has(key)) {
      return moveCache.value.get(key)!
    }
    const data = await $fetch<Move>(`${API_BASE}/move/${nameOrId}`)
    moveCache.value.set(key, data)
    moveCache.value.set(String(data.id), data)
    return data
  }

  // 获取招式伤害类型列表
  const fetchMoveDamageClasses = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/move-damage-class`
    )
    return data.results
  }

  // 获取招式按类型筛选
  const fetchMovesByType = async (typeName: string) => {
    const typeData = await $fetch<{ moves: Array<{ name: string; url: string }> }>(
      `${API_BASE}/type/${typeName}`
    )
    return typeData.moves
  }

  // ========== 地区相关 ==========

  // 获取地区列表
  const fetchRegions = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/region`
    )
    return data.results
  }

  // 获取地区详情
  const fetchRegion = async (name: string): Promise<Region> => {
    if (regionCache.value.has(name)) {
      return regionCache.value.get(name)!
    }
    const data = await $fetch<Region>(`${API_BASE}/region/${name}`)
    regionCache.value.set(name, data)
    return data
  }

  // 获取地点列表
  const fetchLocations = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/location?limit=${limit}&offset=${offset}`
    )
    return { locations: data.results, total: data.count }
  }

  // 获取地点详情
  const fetchLocation = async (nameOrId: string | number): Promise<Location> => {
    const key = String(nameOrId)
    if (locationCache.value.has(key)) {
      return locationCache.value.get(key)!
    }
    const data = await $fetch<Location>(`${API_BASE}/location/${nameOrId}`)
    locationCache.value.set(key, data)
    return data
  }

  // 获取地点区域详情
  const fetchLocationArea = async (nameOrId: string | number): Promise<LocationArea> => {
    return await $fetch<LocationArea>(`${API_BASE}/location-area/${nameOrId}`)
  }

  // ========== 其他 ==========

  // 获取特性列表
  const fetchAbilities = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/ability?limit=${limit}&offset=${offset}`
    )
    return { abilities: data.results, total: data.count }
  }

  // 获取特性详情
  const fetchAbility = async (nameOrId: string | number) => {
    return await $fetch(`${API_BASE}/ability/${nameOrId}`)
  }

  // 获取性格列表
  const fetchNatures = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/nature`
    )
    return data.results
  }

  // 获取性格详情
  const fetchNature = async (name: string) => {
    return await $fetch(`${API_BASE}/nature/${name}`)
  }

  // 获取蛋群列表
  const fetchEggGroups = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/egg-group`
    )
    return data.results
  }

  // 从 URL 获取 ID
  const getIdFromUrl = (url: string): number => {
    return parseInt(url.split('/').filter(Boolean).pop() || '0')
  }

  return {
    // 道具
    fetchItems,
    fetchItem,
    fetchItemCategories,
    fetchItemCategory,
    fetchItemPockets,
    getItemSprite,
    // 招式
    fetchMoves,
    fetchMove,
    fetchMoveDamageClasses,
    fetchMovesByType,
    // 地区
    fetchRegions,
    fetchRegion,
    fetchLocations,
    fetchLocation,
    fetchLocationArea,
    // 其他
    fetchAbilities,
    fetchAbility,
    fetchNatures,
    fetchNature,
    fetchEggGroups,
    // 工具
    getIdFromUrl
  }
}
