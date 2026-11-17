<template>
  <header class="top-header">
    <div class="header-left">
      <el-button link class="hidden-sm-and-down" @click="$emit('toggle')">
        <el-icon :size="18"><Fold /></el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>出海营销台</el-breadcrumb-item>
        <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-tooltip content="模拟数据模式" placement="bottom">
        <el-tag type="info" effect="plain" size="small">Mock</el-tag>
      </el-tooltip>
      <el-button link><el-icon><Bell /></el-icon></el-button>
      <div class="header-user">
        <el-avatar :size="26" class="bg-primary">L</el-avatar>
        <span class="header-user-name">Lena Wang</span>
        <el-icon class="muted"><ArrowDown /></el-icon>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowDown, Bell, Fold } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

defineEmits<{ toggle: [] }>()
const route = useRoute()
</script>
