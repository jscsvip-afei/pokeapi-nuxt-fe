import type { EvolutionChain, Generation, Region, Move } from '~/types/evolution'

const API_BASE = 'https://pokeapi.co/api/v2'

export const useEvolution = () => {
  // 缓存
  const evolutionCache = useState<Map<number, EvolutionChain>>('evolution-cache', () => new Map())
  const generationCache = useState<Map<string, Generation>>('generation-cache', () => new Map())
  const regionCache = useState<Map<string, Region>>('region-cache', () => new Map())
  const moveCache = useState<Map<string, Move>>('move-cache', () => new Map())

  // 获取进化链
  const fetchEvolutionChain = async (id: number): Promise<EvolutionChain> => {
    if (evolutionCache.value.has(id)) {
      return evolutionCache.value.get(id)!
    }

    const data = await $fetch<EvolutionChain>(`${API_BASE}/evolution-chain/${id}`)
    evolutionCache.value.set(id, data)
    return data
  }

  // 通过物种获取进化链ID
  const fetchEvolutionChainBySpecies = async (speciesId: number): Promise<EvolutionChain | null> => {
    try {
      const species = await $fetch<{ evolution_chain: { url: string } }>(`${API_BASE}/pokemon-species/${speciesId}`)
      const chainId = parseInt(species.evolution_chain.url.split('/').filter(Boolean).pop() || '0')
      if (chainId) {
        return await fetchEvolutionChain(chainId)
      }
    } catch (e) {
      console.error('获取进化链失败:', e)
    }
    return null
  }

  // 获取所有进化链（分页）
  const fetchEvolutionChains = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ url: string }>; count: number }>(
      `${API_BASE}/evolution-chain?limit=${limit}&offset=${offset}`
    )
    
    return {
      chains: data.results.map(r => ({
        id: parseInt(r.url.split('/').filter(Boolean).pop() || '0'),
        url: r.url
      })),
      total: data.count
    }
  }

  // 获取世代列表
  const fetchGenerations = async () => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }> }>(
      `${API_BASE}/generation`
    )
    return data.results
  }

  // 获取世代详情
  const fetchGeneration = async (name: string): Promise<Generation> => {
    if (generationCache.value.has(name)) {
      return generationCache.value.get(name)!
    }

    const data = await $fetch<Generation>(`${API_BASE}/generation/${name}`)
    generationCache.value.set(name, data)
    return data
  }

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

  // 获取招式详情
  const fetchMove = async (name: string): Promise<Move> => {
    if (moveCache.value.has(name)) {
      return moveCache.value.get(name)!
    }

    const data = await $fetch<Move>(`${API_BASE}/move/${name}`)
    moveCache.value.set(name, data)
    return data
  }

  // 获取招式列表（分页）
  const fetchMoves = async (limit: number = 20, offset: number = 0) => {
    const data = await $fetch<{ results: Array<{ name: string; url: string }>; count: number }>(
      `${API_BASE}/move?limit=${limit}&offset=${offset}`
    )
    return {
      moves: data.results,
      total: data.count
    }
  }

  // 从物种 URL 获取 ID
  const getSpeciesIdFromUrl = (url: string): number => {
    return parseInt(url.split('/').filter(Boolean).pop() || '0')
  }

  // 获取宝可梦图片
  const getPokemonSprite = (speciesId: number, type: 'default' | 'shiny' | 'artwork' = 'artwork'): string => {
    if (type === 'artwork') {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`
    } else if (type === 'shiny') {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${speciesId}.png`
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`
  }

  return {
    fetchEvolutionChain,
    fetchEvolutionChainBySpecies,
    fetchEvolutionChains,
    fetchGenerations,
    fetchGeneration,
    fetchRegions,
    fetchRegion,
    fetchMove,
    fetchMoves,
    getSpeciesIdFromUrl,
    getPokemonSprite
  }
}
