// 特性相关类型
export interface Ability {
  id: number
  name: string
  is_main_series: boolean
  generation: { name: string; url: string }
  names: Array<{ name: string; language: { name: string; url: string } }>
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: { name: string; url: string }
  }>
  effect_changes: Array<{
    version_group: { name: string; url: string }
    effect_entries: Array<{
      effect: string
      language: { name: string; url: string }
    }>
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string; url: string }
    version_group: { name: string; url: string }
  }>
  pokemon: Array<{
    is_hidden: boolean
    slot: number
    pokemon: { name: string; url: string }
  }>
}

// 世代中文名
export const GENERATION_NAMES_ZH: Record<string, string> = {
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
