<template>
  <div class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost text-xl gap-2">
        <span class="text-2xl">🔴</span>
        <span class="hidden sm:inline">{{ t.home.title }}</span>
      </NuxtLink>
    </div>
    <div class="flex-none gap-1">
      <!-- 页面导航 -->
      <ul class="menu menu-horizontal px-1 hidden xl:flex">
        <li>
          <NuxtLink 
            to="/" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/' }"
          >
            📖 {{ t.nav.pokedex }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/evolution" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/evolution' }"
          >
            🔄 {{ t.nav.evolution }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/moves" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/moves' }"
          >
            ⚔️ {{ t.nav.moves }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/items" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/items' }"
          >
            🎒 {{ t.nav.items }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/abilities" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/abilities' }"
          >
            ✨ {{ t.nav.abilities }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/natures" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/natures' }"
          >
            🎭 {{ t.nav.natures }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/berries" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/berries' }"
          >
            🍇 {{ t.nav.berries }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/regions" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/regions' }"
          >
            🗺️ {{ t.nav.regions }}
          </NuxtLink>
        </li>
        <!-- 主题切换 -->
        <li class="dropdown dropdown-end">
          <ThemeSwitcher />
        </li>
        <!-- 语言切换 -->
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
      
      <!-- 移动端下拉菜单 -->
      <div class="dropdown dropdown-end xl:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52">
          <li><NuxtLink to="/">📖 {{ t.nav.pokedex }}</NuxtLink></li>
          <li><NuxtLink to="/evolution">🔄 {{ t.nav.evolution }}</NuxtLink></li>
          <li><NuxtLink to="/moves">⚔️ {{ t.nav.moves }}</NuxtLink></li>
          <li><NuxtLink to="/items">🎒 {{ t.nav.items }}</NuxtLink></li>
          <li><NuxtLink to="/abilities">✨ {{ t.nav.abilities }}</NuxtLink></li>
          <li><NuxtLink to="/natures">🎭 {{ t.nav.natures }}</NuxtLink></li>
          <li><NuxtLink to="/berries">🍇 {{ t.nav.berries }}</NuxtLink></li>
          <li><NuxtLink to="/regions">🗺️ {{ t.nav.regions }}</NuxtLink></li>
          <li class="mt-2 border-t border-base-200 pt-2 dropdown dropdown-bottom dropdown-end"><ThemeSwitcher /></li>
          <li><LanguageSwitcher /></li>
        </ul>
      </div>
      
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettings } from '~/composables/useSettings'

const route = useRoute()
const { t } = useSettings()
</script>
