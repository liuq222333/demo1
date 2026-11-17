<template>
  <div>
    <div class="page-toolbar">
      <div>
        <h1 class="page-title">服务方案</h1>
        <p class="page-description">将客户分析结果整理为可确认、可执行的服务方案。</p>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="openGenerate">
          <el-icon><MagicStick /></el-icon>生成方案
        </el-button>
      </div>
    </div>

    <ContentWrap>
      <el-form :model="query" inline class="filter-form" label-width="70px">
        <el-form-item label="客户名称">
          <el-input v-model="query.companyName" clearable placeholder="请输入客户名称" class="w-240px" />
        </el-form-item>
        <el-form-item label="方案状态">
          <el-select v-model="query.status" clearable placeholder="全部" class="w-140px">
            <el-option label="草稿" value="草稿" />
            <el-option label="待确认" value="待确认" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterRows"><el-icon><Search /></el-icon>搜索</el-button>
          <el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table :data="rows" stripe size="small" empty-text="暂无方案">
        <el-table-column prop="id" label="编号" width="70" align="center" />
        <el-table-column label="客户名称" min-width="260">
          <template #default="{ row }">{{ companyName(row.leadId) }}</template>
        </el-table-column>
        <el-table-column prop="timeline" label="执行周期" min-width="180" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }"><el-tag size="small" :type="proposalTagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="170" fixed="right" align="center">
          <template #default="{ row }">
            <div class="table-actions">
              <el-button link type="primary" @click="openDetail(row)">查看方案</el-button>
              <el-button link type="primary" @click="openTasks(row)">执行任务</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <el-drawer v-model="drawerVisible" title="服务方案详情" size="650px">
      <template v-if="selectedProposal">
        <div class="proposal-head">
          <div>
            <div class="muted">服务对象</div>
            <div class="proposal-company">{{ companyName(selectedProposal.leadId) }}</div>
          </div>
          <el-tag :type="proposalTagType(selectedProposal.status)">{{ selectedProposal.status }}</el-tag>
        </div>
        <div class="ai-meta-row"><el-tag size="small" type="info">AI 置信度 {{ Math.round((selectedProposal.confidence || 0.8) * 100) }}%</el-tag><span>方案由客户分析、沟通内容和案例目标生成</span></div>
        <div class="drawer-block"><div class="drawer-label">客户现状</div><p>{{ selectedProposal.situation }}</p></div>
        <div class="drawer-block"><div class="drawer-label">项目目标</div><ul class="compact-list"><li v-for="item in selectedProposal.goals" :key="item">{{ item }}</li></ul></div>
        <div class="drawer-block"><div class="drawer-label">执行策略</div><ul class="compact-list"><li v-for="item in selectedProposal.strategy" :key="item">{{ item }}</li></ul></div>
        <div class="drawer-block"><div class="drawer-label">交付物</div><div class="tag-list"><el-tag v-for="item in selectedProposal.deliverables" :key="item" size="small" effect="plain">{{ item }}</el-tag></div></div>
        <div class="drawer-block"><div class="drawer-label">周期与目标指标</div><p>{{ selectedProposal.timeline }}</p><el-table :data="selectedProposal.targetMetrics" size="small" border class="metric-table"><el-table-column prop="label" label="指标" min-width="125" /><el-table-column prop="baseline" label="基线" width="70" /><el-table-column prop="target" label="目标" width="70" /><el-table-column prop="unit" label="单位" width="70" /></el-table></div>
        <div v-if="selectedProposal.assumptions?.length" class="drawer-block"><div class="drawer-label">执行前提</div><ul class="compact-list"><li v-for="item in selectedProposal.assumptions" :key="item">{{ item }}</li></ul></div>
        <div v-if="selectedProposal.riskNotes?.length" class="drawer-block"><div class="drawer-label">风险提示</div><ul class="compact-list"><li v-for="item in selectedProposal.riskNotes" :key="item">{{ item }}</li></ul></div>
        <div class="drawer-actions"><el-button type="primary" size="small" :loading="decomposeLoading" @click="confirmAndDecompose"><el-icon><List /></el-icon>确认方案并拆解任务</el-button><el-button size="small" @click="copyProposal"><el-icon><CopyDocument /></el-icon>复制方案</el-button><el-button size="small" @click="router.push('/tasks')">查看执行任务</el-button></div>
      </template>
      <el-empty v-else description="请选择一条方案" />
    </el-drawer>

    <el-dialog v-model="generateVisible" title="生成服务方案" width="520px">
      <el-form label-width="90px">
        <el-form-item label="选择客户">
          <el-select v-model="generateLeadId" class="w-full" placeholder="请选择已分析客户">
            <el-option v-for="lead in store.leads" :key="lead.id" :label="lead.companyName" :value="lead.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="generateVisible = false">取消</el-button>
        <el-button type="primary" :loading="generateLoading" @click="generate">生成方案</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument, List, MagicStick, Refresh, Search } from '@element-plus/icons-vue'
import ContentWrap from '../../components/ContentWrap.vue'
import { useOverseasStore } from '../../stores/overseas'
import type { Proposal } from '../../types/overseas'
import { proposalTagType } from '../../utils/status'
import { useRouter } from 'vue-router'

const store = useOverseasStore()
const router = useRouter()
const query = reactive({ companyName: '', status: '' })
const rows = ref<Proposal[]>([])
const drawerVisible = ref(false)
const generateVisible = ref(false)
const generateLoading = ref(false)
const decomposeLoading = ref(false)
const generateLeadId = ref(1)
const selectedProposal = computed(() => store.selectedProposal)

function companyName(leadId: number) { return store.leads.find((item) => item.id === leadId)?.companyName || `客户 #${leadId}` }
function buildRows() { rows.value = store.proposals.slice() }
function filterRows() { rows.value = store.proposals.filter((item) => (!query.status || item.status === query.status) && (!query.companyName || companyName(item.leadId).toLowerCase().includes(query.companyName.toLowerCase()))) }
function reset() { Object.assign(query, { companyName: '', status: '' }); buildRows() }
function openDetail(row: Proposal) { store.selectedProposal = row; drawerVisible.value = true }
function openTasks(row: Proposal) { store.selectedProposal = row; router.push('/tasks') }
function openGenerate() { generateLeadId.value = store.selectedLeadId || store.leads[0]?.id || 1; generateVisible.value = true }
async function generate() { generateLoading.value = true; try { const result = await store.generateProposal(generateLeadId.value); store.upsertProposal(result); buildRows(); generateVisible.value = false; drawerVisible.value = true; ElMessage.info('AI 方案已生成，请确认内容') } catch { ElMessage.error('方案生成失败，请稍后重试') } finally { generateLoading.value = false } }
async function confirmAndDecompose() {
  if (!selectedProposal.value) return
  decomposeLoading.value = true
  try { await store.updateProposalStatus(selectedProposal.value.id, '执行中'); await store.decomposeProposal(selectedProposal.value.id); router.push('/tasks'); ElMessage.info('方案已确认，AI 已拆解执行任务') } catch { ElMessage.error('任务拆解失败，请稍后重试') } finally { decomposeLoading.value = false }
}
async function copyProposal() { if (!selectedProposal.value) return; const proposal = selectedProposal.value; const text = [`# ${companyName(proposal.leadId)} 服务方案`, `\n## 客户现状\n${proposal.situation}`, `\n## 项目目标\n${proposal.goals.map((item) => `- ${item}`).join('\n')}`, `\n## 执行策略\n${proposal.strategy.map((item) => `- ${item}`).join('\n')}`, `\n## 目标指标\n${proposal.targetMetrics.map((item) => `- ${item.label}：${item.target}${item.unit}`).join('\n')}`].join('\n'); await navigator.clipboard?.writeText(text); ElMessage.info('方案内容已复制') }
onMounted(async () => { if (!store.leads.length) await store.loadLeads({ pageNo: 1, pageSize: 10 }); if (!store.proposals.length) await store.loadProposals(); buildRows() })
</script>

<style scoped>
.proposal-head { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 18px; border-bottom: 1px solid var(--app-border-color); }
.proposal-company { margin-top: 5px; color: var(--app-text-primary); font-size: 17px; font-weight: 600; }
.drawer-block { padding: 16px 0; border-bottom: 1px solid var(--app-border-color); }
.drawer-label { margin-bottom: 8px; color: var(--app-text-primary); font-size: 14px; font-weight: 600; }
.drawer-block p { margin: 0; color: var(--app-text-regular); line-height: 1.8; }
.compact-list { margin: 0; padding-left: 18px; color: var(--app-text-regular); line-height: 1.9; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.ai-meta-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: var(--app-text-secondary); font-size: 12px; }
.drawer-actions { display: flex; gap: 8px; padding-top: 14px; }
.metric-table { margin-top: 10px; }
</style>
