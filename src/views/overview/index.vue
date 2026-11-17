<template>
  <div>
    <div class="page-toolbar">
      <div>
        <h1 class="page-title">营销总览</h1>
        <p class="page-description">{{ store.currentCase?.name || 'AI 出海营销项目' }} · {{ store.currentCase?.goal }}</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="router.push('/leads')"><el-icon><User /></el-icon>查看潜客</el-button>
      </div>
    </div>

    <div class="metric-grid">
      <MetricCard label="AI 企业线索" :value="store.leadTotal || 5" detail="公开信号与导入客户" />
      <MetricCard label="高优先级客户" value="1" detail="建议本周完成首次触达" />
      <MetricCard label="有效线索" :value="store.metrics?.values.qualifiedLeads || 19" detail="达到销售跟进标准" />
      <MetricCard label="触达回复率" :value="`${store.metrics?.values.replyRate || 15}%`" detail="首轮联系结果" />
    </div>

    <el-row :gutter="15">
      <el-col :xs="24" :lg="14">
        <ContentWrap title="渠道线索质量">
          <BaseChart :option="channelOption" />
        </ContentWrap>
      </el-col>
      <el-col :xs="24" :lg="10">
        <ContentWrap title="项目进度">
          <div class="progress-summary">
            <div class="flex items-center justify-between"><span class="muted">整体执行进度</span><strong>62%</strong></div>
            <el-progress :percentage="62" :stroke-width="10" :show-text="false" />
            <div class="mt-3 grid grid-cols-3 gap-3 text-center">
              <div><div class="text-18px font-600">{{ store.leadTotal || 5 }}</div><div class="muted text-12px">AI 企业</div></div>
              <div><div class="text-18px font-600">2</div><div class="muted text-12px">已完成任务</div></div>
              <div><div class="text-18px font-600">{{ store.metrics?.values.qualifiedLeads || 19 }}</div><div class="muted text-12px">合格线索</div></div>
            </div>
          </div>
        </ContentWrap>
        <ContentWrap title="最近任务">
          <el-timeline class="compact-timeline">
            <el-timeline-item v-for="task in recentTasks" :key="task.id" :timestamp="task.dueDate" placement="top" :type="task.status === '已完成' ? 'info' : 'primary'">
              <div class="flex items-center justify-between gap-3"><span>{{ task.title }}</span><el-tag size="small" :type="taskTagType(task.status)">{{ task.status }}</el-tag></div>
            </el-timeline-item>
          </el-timeline>
        </ContentWrap>
      </el-col>
    </el-row>

    <ContentWrap title="重点潜客">
      <el-table :data="priorityLeads" stripe size="small">
        <el-table-column prop="companyName" label="客户名称" min-width="260" show-overflow-tooltip />
        <el-table-column prop="country" label="国家" width="100" />
        <el-table-column prop="aiCategory" label="AI 赛道" width="140" />
        <el-table-column prop="fitScore" label="匹配度" width="100" align="center"><template #default="{ row }"><span class="font-600 text-primary">{{ row.fitScore }}</span></template></el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" align="center"><template #default="{ row }"><el-tag size="small" :type="priorityTagType(row.priority)">{{ row.priority }}</el-tag></template></el-table-column>
        <el-table-column prop="followUpStatus" label="跟进状态" width="110" align="center" />
        <el-table-column label="操作" width="100" align="center"><template #default="{ row }"><el-button link type="primary" @click="router.push('/leads')">查看</el-button></template></el-table-column>
      </el-table>
    </ContentWrap>

    <ContentWrap title="AI 下一步建议">
      <div class="ai-next-step"><div><div class="ai-next-title">先完成高优先级 AI 企业的首次触达</div><p>AI 根据客户匹配度、企业信号和来源可靠性，建议优先分析并联系 {{ store.currentCase?.name?.split(' · ')[0] || '星澜智能' }}。</p></div><el-button type="primary" plain @click="router.push('/leads')">进入 AI 分析</el-button></div>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { useRouter } from 'vue-router'
import { User } from '@element-plus/icons-vue'
import ContentWrap from '../../components/ContentWrap.vue'
import MetricCard from '../../components/MetricCard.vue'
import BaseChart from '../../components/BaseChart.vue'
import { useOverseasStore } from '../../stores/overseas'
import { priorityTagType, taskTagType } from '../../utils/status'

const router = useRouter()
const store = useOverseasStore()
const priorityLeads = computed(() => store.leads.filter((item) => item.priority === '高'))
const recentTasks = computed(() => store.tasks.slice(0, 4))
const channelOption = computed<EChartsOption>(() => ({
  color: ['#409eff', '#e6a23c', '#909399'],
  tooltip: { trigger: 'axis' },
  grid: { left: 10, right: 15, top: 24, bottom: 10, containLabel: true },
  xAxis: { type: 'category', data: store.metrics?.channelData.map((item) => item.channel) || [] },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f2f5' } } },
  series: [{ type: 'bar', barWidth: 26, data: store.metrics?.channelData.map((item) => item.leads) || [] }],
}))
</script>

<style scoped>
.progress-summary { padding: 12px 2px 2px; }
.progress-summary strong { color: var(--el-color-primary); font-size: 22px; font-weight: 600; }
.compact-timeline { margin: 8px 0 0; padding-left: 4px; }
.ai-next-step { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.ai-next-title { color: var(--app-text-primary); font-weight: 600; }
.ai-next-step p { margin: 6px 0 0; color: var(--app-text-regular); line-height: 1.7; }
@media (max-width: 720px) { .ai-next-step { align-items: flex-start; flex-direction: column; } }
</style>
