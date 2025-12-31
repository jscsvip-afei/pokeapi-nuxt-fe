import type { Pokemon, PokemonDetail, PokemonSpecies } from '~/types/pokemon'

const API_BASE = 'https://pokeapi.co/api/v2'

export const usePokemon = () => {
  // 缓存详情数据
  const detailCache = useState<Map<number, PokemonDetail>>('pokemon-detail-cache', () => new Map())
  const speciesCache = useState<Map<number, PokemonSpecies>>('pokemon-species-cache', () => new Map())

  // 获取宝可梦列表
  const fetchPokemonList = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`
    )
    
    const pokemonsWithId: Pokemon[] = data.results.map((pokemon, index) => ({
      ...pokemon,
      id: offset + index + 1
    }))
    
    return {
      pokemons: pokemonsWithId,
      total: data.count
    }
  }

  // 获取宝可梦详情
  const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
    // 检查缓存
    if (detailCache.value.has(id)) {
      return detailCache.value.get(id)!
    }

    const data = await $fetch<PokemonDetail>(`${API_BASE}/pokemon/${id}`)
    detailCache.value.set(id, data)
    return data
  }

  // 获取宝可梦物种信息（包含描述）
  const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
    // 检查缓存
    if (speciesCache.value.has(id)) {
      return speciesCache.value.get(id)!
    }

    const data = await $fetch<PokemonSpecies>(`${API_BASE}/pokemon-species/${id}`)
    speciesCache.value.set(id, data)
    return data
  }

  // 获取所有类型
  const fetchTypes = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/type`
    )
    return data.results.filter(t => t.name !== 'unknown' && t.name !== 'shadow')
  }

  // 获取某类型的所有宝可梦
  const fetchPokemonsByType = async (typeName: string) => {
    const data = await $fetch<{
      pokemon: Array<{ pokemon: { name: string; url: string }; slot: number }>
    }>(`${API_BASE}/type/${typeName}`)
    
    return data.pokemon.map(p => {
      const urlParts = p.pokemon.url.split('/')
      const idStr = urlParts[urlParts.length - 2] || '0'
      const id = parseInt(idStr)
      return {
        id,
        name: p.pokemon.name,
        url: p.pokemon.url
      }
    }).filter(p => p.id <= 1010) // 只保留正式编号的宝可梦
  }

  // 获取精灵图 URL
  const getSpriteUrl = (id: number, type: 'default' | 'shiny' | 'artwork' | 'home' = 'default') => {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
    switch (type) {
      case 'shiny':
        return `${baseUrl}/shiny/${id}.png`
      case 'artwork':
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      case 'home':
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
      default:
        return `${baseUrl}/${id}.png`
    }
  }

  return {
    fetchPokemonList,
    fetchPokemonDetail,
    fetchPokemonSpecies,
    fetchTypes,
    fetchPokemonsByType,
    getSpriteUrl,
  }
}

// 收藏功能
export const useFavorites = () => {
  const favorites = useState<Set<number>>('pokemon-favorites', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('pokemon-favorites')
      return new Set(saved ? JSON.parse(saved) : [])
    }
    return new Set()
  })

  const isFavorite = (id: number) => favorites.value.has(id)

  const toggleFavorite = (id: number) => {
    if (favorites.value.has(id)) {
      favorites.value.delete(id)
    } else {
      favorites.value.add(id)
    }
    // 持久化到 localStorage
    if (import.meta.client) {
      localStorage.setItem('pokemon-favorites', JSON.stringify([...favorites.value]))
    }
  }

  const getFavorites = () => [...favorites.value]

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    getFavorites,
  }
}
