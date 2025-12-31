import { translations, type Language, type Translations } from '~/locales'

// 可用主题列表
export const THEMES = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween',
  'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
  'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn',
  'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
  'dim', 'nord', 'sunset'
] as const

export type Theme = typeof THEMES[number]

export const useSettings = () => {
  // 主题状态
  const theme = useState<Theme>('theme', () => 'light')
  
  // 语言状态
  const language = useState<Language>('language', () => 'zh')
  
  // 当前翻译
  const t = computed<Translations>(() => translations[language.value])

  // 初始化设置（从 localStorage 读取）
  const initSettings = () => {
    if (import.meta.client) {
      // 读取保存的主题
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && THEMES.includes(savedTheme)) {
        theme.value = savedTheme
      } else {
        // 检测系统偏好
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          theme.value = 'dark'
        }
      }
      
      // 读取保存的语言
      const savedLang = localStorage.getItem('language') as Language
      if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        language.value = savedLang
      }
      
      // 应用主题
      applyTheme(theme.value)
    }
  }

  // 应用主题到 HTML
  const applyTheme = (newTheme: Theme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  // 切换主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme(newTheme)
    if (import.meta.client) {
      localStorage.setItem('theme', newTheme)
    }
  }

  // 切换语言
  const setLanguage = (lang: Language) => {
    language.value = lang
    if (import.meta.client) {
      localStorage.setItem('language', lang)
    }
  }

  // 切换语言快捷方式
  const toggleLanguage = () => {
    setLanguage(language.value === 'zh' ? 'en' : 'zh')
  }

  return {
    theme: readonly(theme),
    language: readonly(language),
    t,
    THEMES,
    initSettings,
    setTheme,
    setLanguage,
    toggleLanguage
  }
}
