<template>
  <div class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost text-xl gap-2">
        <span class="text-2xl">🔴</span>
        <span class="hidden sm:inline">宝可梦图鉴</span>
      </NuxtLink>
    </div>
    <div class="flex-none gap-2">
      <!-- 页面导航 -->
      <ul class="menu menu-horizontal px-1 hidden lg:flex">
        <li>
          <NuxtLink 
            to="/" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/' }"
          >
            📖 图鉴
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/evolution" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/evolution' }"
          >
            🔄 进化
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/moves" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/moves' }"
          >
            ⚔️ 招式
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/items" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/items' }"
          >
            🎒 道具
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/regions" 
            class="btn btn-ghost btn-sm"
            :class="{ 'btn-active': route.path === '/regions' }"
          >
            🗺️ 地区
          </NuxtLink>
        </li>
      </ul>
      
      <!-- 移动端下拉菜单 -->
      <div class="dropdown dropdown-end lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><NuxtLink to="/">📖 图鉴</NuxtLink></li>
          <li><NuxtLink to="/evolution">🔄 进化链</NuxtLink></li>
          <li><NuxtLink to="/moves">⚔️ 招式</NuxtLink></li>
          <li><NuxtLink to="/items">🎒 道具</NuxtLink></li>
          <li><NuxtLink to="/regions">🗺️ 地区</NuxtLink></li>
        </ul>
      </div>
      
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
