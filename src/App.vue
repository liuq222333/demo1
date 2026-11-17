<template>
  <div class="app-shell">
    <SidebarNav :collapsed="collapsed" />
    <div class="main-shell" :class="{ 'is-collapsed': collapsed }">
      <TopHeader @toggle="collapsed = !collapsed" />
      <div class="tags-bar">
        <span class="tag-item is-active"><span class="tag-dot" />{{ route.meta.title || '营销总览' }}</span>
      </div>
      <CaseContextBar />
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SidebarNav from './layout/SidebarNav.vue'
import TopHeader from './layout/TopHeader.vue'
import CaseContextBar from './components/CaseContextBar.vue'
import { useOverseasStore } from './stores/overseas'

const route = useRoute()
const store = useOverseasStore()
const collapsed = ref(false)

onMounted(() => store.bootstrap())
</script>
