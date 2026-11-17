<template>
  <div>
    <div class="page-toolbar"><div><h1 class="page-title">数据复盘</h1><p class="page-description">对照方案目标和实际结果判断效果，再把改进项转成下一轮任务。</p></div><div class="page-actions"><el-button plain type="primary" :loading="nextLoading" @click="nextRound"><el-icon><RefreshRight /></el-icon>生成下一轮计划</el-button><el-button type="primary" :loading="loading" @click="generate"><el-icon><MagicStick /></el-icon>生成复盘</el-button></div></div>
    <template v-if="store.metrics">
      <div class="metric-grid"><MetricCard label="曝光量" :value="formatNumber(store.metrics.values.impressions)" detail="本轮触达总曝光" /><MetricCard label="有效线索" :value="store.metrics.values.leads" detail="目标 60 条" /><MetricCard label="销售合格线索" :value="store.metrics.values.qualifiedLeads" detail="目标 20 条" /><MetricCard label="触达回复率" :value="`${store.metrics.values.replyRate}%`" detail="目标 18%" /></div>
      <div class="review-grid"><ContentWrap title="渠道表现"><BaseChart :option="channelOption" height="260px" /></ContentWrap><ContentWrap title="复盘摘要"><div v-if="store.review" class="summary-copy">{{ store.review.summary }}</div><el-skeleton v-else :rows="4" animated /><div v-if="store.review" class="ai-meta-row"><el-tag size="small" type="info">AI 置信度 {{ Math.round((store.review.confidence || 0.8) * 100) }}%</el-tag><span>基于渠道、线索和方案指标生成</span></div><div v-if="store.review" class="next-action"><span class="next-label">下一步</span>{{ store.review.nextAction }}</div></ContentWrap></div>
      <ContentWrap title="目标 vs 实际"><el-table :data="store.review?.comparisons || []" size="small" border><el-table-column prop="label" label="指标" min-width="130" /><el-table-column prop="baseline" label="基线" width="90" /><el-table-column prop="target" label="目标" width="90" /><el-table-column label="实际" width="90"><template #default="{ row }">{{ row.actual }}{{ row.unit }}</template></el-table-column><el-table-column label="结果" width="115" align="center"><template #default="{ row }"><el-tag size="small" :type="row.achieved ? 'info' : 'danger'">{{ row.achieved ? '已达成' : '未达成' }}</el-tag></template></el-table-column><el-table-column prop="note" label="说明" min-width="180" /></el-table></ContentWrap>
      <div class="review-grid lower-grid"><ContentWrap title="关键洞察"><ul v-if="store.review" class="review-list"><li v-for="item in store.review.insights" :key="item">{{ item }}</li></ul><el-skeleton v-else :rows="3" animated /></ContentWrap><ContentWrap title="改进项"><div v-if="store.review" class="improvement-list"><div v-for="item in store.review.improvements" :key="item.id" class="improvement-item"><div><strong>{{ item.title }}</strong><p>{{ item.detail }}</p></div><el-tag size="small" type="warning">{{ metricLabel(item.expectedMetric) }} +{{ item.expectedDelta }}</el-tag></div></div><el-skeleton v-else :rows="3" animated /></ContentWrap></div>
      <ContentWrap v-if="store.review?.evidence?.length" title="复盘依据"><div class="evidence-list"><el-tag v-for="item in store.review.evidence" :key="item" size="small" type="info">{{ item }}</el-tag></div></ContentWrap>
    </template>
    <el-empty v-else description="正在加载复盘数据" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { ElMessage } from 'element-plus'
import { MagicStick, RefreshRight } from '@element-plus/icons-vue'
import ContentWrap from '../../components/ContentWrap.vue'
import MetricCard from '../../components/MetricCard.vue'
import BaseChart from '../../components/BaseChart.vue'
import { useOverseasStore } from '../../stores/overseas'
import { metricCatalog } from '../../utils/metrics'
import type { MetricKey } from '../../types/overseas'

const store = useOverseasStore(); const loading = ref(false); const nextLoading = ref(false)
const channelOption = computed<EChartsOption>(() => ({ tooltip: { trigger: 'axis' }, grid: { left: 18, right: 18, top: 18, bottom: 26, containLabel: true }, xAxis: { type: 'category', data: store.metrics?.channelData.map((item) => item.channel) || [], axisLine: { lineStyle: { color: '#dcdfe6' } }, axisLabel: { color: '#909399' } }, yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f2f5' } }, axisLabel: { color: '#909399' } }, series: [{ type: 'bar', barWidth: 28, data: store.metrics?.channelData.map((item) => item.leads) || [], itemStyle: { color: '#409eff', borderRadius: [2, 2, 0, 0] } }] }))
function formatNumber(value: number) { return value.toLocaleString('zh-CN') }
function metricLabel(key: MetricKey) { return metricCatalog[key].label }
async function generate() { loading.value = true; try { await store.generateReview(); ElMessage.info('复盘结果已更新') } finally { loading.value = false } }
async function nextRound() { nextLoading.value = true; try { await store.generateNextRound(); ElMessage.info('下一轮任务已生成，请到执行交付查看') } finally { nextLoading.value = false } }
onMounted(async () => { if (!store.metrics) await store.loadMetrics(); if (!store.review) await store.generateReview() })
</script>

<style scoped>
.review-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 15px; }
.lower-grid { margin-top: 0; }
.summary-copy { color: var(--app-text-regular); line-height: 1.9; }
.next-action { margin-top: 18px; padding: 10px 12px; color: var(--app-text-regular); background: #f5f7fa; border-left: 3px solid var(--el-color-primary); line-height: 1.7; }
.next-label { margin-right: 8px; color: var(--el-color-primary); font-weight: 600; }
.review-list { margin: 0; padding-left: 18px; color: var(--app-text-regular); line-height: 2; }
.ai-meta-row { display: flex; align-items: center; gap: 8px; margin-top: 14px; color: var(--app-text-secondary); font-size: 12px; }
.evidence-list { display: flex; flex-wrap: wrap; gap: 8px; }
.improvement-list { display: grid; gap: 8px; }
.improvement-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--app-border-color); }
.improvement-item strong { color: var(--app-text-primary); font-size: 13px; }
.improvement-item p { margin: 5px 0 0; color: var(--app-text-regular); font-size: 12px; line-height: 1.7; }
@media (max-width: 900px) { .review-grid { grid-template-columns: 1fr; } }
</style>
