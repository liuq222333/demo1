<template>
  <div v-if="store.currentCase" class="case-context-bar">
    <div class="case-context-main">
      <span class="case-context-label">当前案例</span>
      <strong>{{ store.currentCase.name }}</strong>
      <span class="case-round">第 {{ store.currentCase.round }} 轮</span>
      <el-tag size="small" type="info">{{ currentStage }}</el-tag>
    </div>
    <div class="case-stage-list">
      <span v-for="(stage, index) in stages" :key="stage" class="case-stage" :class="{ 'is-current': currentStage === stage, 'is-done': index < currentIndex }"><i>{{ index + 1 }}</i>{{ stage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOverseasStore } from '../stores/overseas'
import type { CaseStage } from '../types/overseas'

const store = useOverseasStore()
const route = useRoute()
const stages: CaseStage[] = ['潜客分析', '首次触达', '方案确认', '执行交付', '数据复盘']
const currentStage = computed<CaseStage>(() => (route.meta.stage as CaseStage) || store.currentCase?.stage || '潜客分析')
const currentIndex = computed(() => Math.max(0, stages.indexOf(currentStage.value)))
</script>
