<template>
  <aside class="sidebar" :class="{ 'is-collapsed': collapsed }">
    <div class="sidebar-logo">
      <span class="sidebar-logo-mark"><TrendCharts /></span>
      <span class="sidebar-logo-title">出海营销台</span>
    </div>
    <el-menu :default-active="route.path" :collapse="collapsed" :collapse-transition="false" router>
      <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { DataAnalysis, Document, List, Odometer, TrendCharts, User } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

defineProps<{ collapsed: boolean }>()
const route = useRoute()
const menus = [
  { path: '/overview', title: '营销总览', icon: Odometer },
  { path: '/leads', title: '潜客分析', icon: User },
  { path: '/follow-up', title: '客户跟进', icon: List },
  { path: '/proposals', title: '服务方案', icon: Document },
  { path: '/tasks', title: '执行任务', icon: List },
  { path: '/review', title: '数据复盘', icon: DataAnalysis },
]
</script>
