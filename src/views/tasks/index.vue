<template>
  <div>
    <div class="page-toolbar">
      <div>
        <h1 class="page-title">执行交付</h1>
        <p class="page-description">把方案拆成负责人、时间和交付物明确的任务。</p>
      </div>
      <div class="page-actions"><el-button plain type="primary" @click="openDecompose"><el-icon><MagicStick /></el-icon>AI 拆解方案</el-button><el-button type="primary" @click="refresh"><el-icon><Refresh /></el-icon>刷新任务</el-button></div>
    </div>

    <ContentWrap>
      <el-form :model="query" inline class="filter-form" label-width="70px">
        <el-form-item label="任务名称"><el-input v-model="query.keyword" clearable placeholder="请输入任务名称" class="w-240px" /></el-form-item>
        <el-form-item label="任务状态"><el-select v-model="query.status" clearable placeholder="全部" class="w-140px"><el-option label="待开始" value="待开始" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已逾期" value="已逾期" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="filterRows"><el-icon><Search /></el-icon>搜索</el-button><el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table :data="rows" stripe size="small" empty-text="暂无任务">
        <el-table-column prop="title" label="任务名称" min-width="260" show-overflow-tooltip />
        <el-table-column prop="description" label="任务说明" min-width="310" show-overflow-tooltip />
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="dueDate" label="截止日期" width="125" />
        <el-table-column label="状态" width="145" align="center">
          <template #default="{ row }"><el-select :model-value="row.status" size="small" @change="onStatusChange(row, $event)"><el-option label="待开始" value="待开始" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已逾期" value="已逾期" /></el-select></template>
        </el-table-column>
        <el-table-column label="来源" width="100" align="center"><template #default="{ row }"><el-tag size="small" type="info">{{ row.source || '人工' }}</el-tag></template></el-table-column>
        <el-table-column label="交付物" min-width="210"><template #default="{ row }"><el-button v-if="row.deliverySampleId" link type="primary" @click="openDelivery(row)">{{ row.deliverable }} · 查看样例</el-button><span v-else>{{ row.deliverable }}</span></template></el-table-column>
      </el-table>
    </ContentWrap>

    <el-dialog v-model="decomposeVisible" title="AI 拆解执行任务" width="640px">
      <el-alert title="AI 会根据方案目标、交付物和执行周期生成首轮任务，生成后仍可调整负责人和日期。" type="info" :closable="false" />
      <el-form label-width="90px" class="decompose-form">
        <el-form-item label="选择方案"><el-select v-model="decomposeProposalId" class="w-full" placeholder="请选择方案"><el-option v-for="proposal in store.proposals" :key="proposal.id" :label="proposalName(proposal.leadId)" :value="proposal.id" /></el-select></el-form-item>
      </el-form>
      <div v-loading="decomposeLoading" class="decompose-result">
        <template v-if="generatedTasks.length">
          <div class="result-title">AI 已生成 {{ generatedTasks.length }} 个任务</div>
          <div v-for="task in generatedTasks" :key="task.id" class="generated-task"><div><strong>{{ task.title }}</strong><p>{{ task.description }}</p></div><el-tag size="small" type="info">{{ task.dueDate }}</el-tag></div>
        </template>
        <el-empty v-else description="选择方案后点击 AI 拆解" :image-size="70" />
      </div>
      <template #footer><el-button @click="decomposeVisible = false">关闭</el-button><el-button type="primary" :loading="decomposeLoading" @click="decompose">开始拆解</el-button></template>
    </el-dialog>
    <el-drawer v-model="deliveryVisible" title="交付样例预览" size="680px"><DeliveryPreview :delivery="store.selectedDelivery" /></el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, Refresh, Search } from '@element-plus/icons-vue'
import ContentWrap from '../../components/ContentWrap.vue'
import DeliveryPreview from '../../components/DeliveryPreview.vue'
import { useOverseasStore } from '../../stores/overseas'
import type { MarketingTask, TaskStatus } from '../../types/overseas'

const store = useOverseasStore()
const query = reactive({ keyword: '', status: '' })
const rows = ref<MarketingTask[]>([])
const decomposeVisible = ref(false)
const decomposeLoading = ref(false)
const decomposeProposalId = ref(1)
const generatedTasks = ref<MarketingTask[]>([])
const deliveryVisible = ref(false)
const filteredRows = computed(() => store.tasks.filter((item) => (!query.status || item.status === query.status) && (!query.keyword || `${item.title}${item.description}`.includes(query.keyword))))
function refreshRows() { rows.value = filteredRows.value.slice() }
function filterRows() { refreshRows() }
function reset() { Object.assign(query, { keyword: '', status: '' }); refreshRows() }
async function refresh() { await store.loadTasks(); refreshRows() }
async function changeStatus(row: MarketingTask, value: TaskStatus) { await store.updateTaskStatus(row.id, value); refreshRows(); ElMessage.info('任务状态已更新') }
function onStatusChange(row: MarketingTask, value: unknown) { if (typeof value === 'string') changeStatus(row, value as TaskStatus) }
function proposalName(leadId: number) { return store.leads.find((item) => item.id === leadId)?.companyName || `方案 #${leadId}` }
function openDecompose() { decomposeProposalId.value = store.selectedProposal?.id || store.proposals[0]?.id || 1; generatedTasks.value = []; decomposeVisible.value = true }
async function openDelivery(task: MarketingTask) { if (!task.deliverySampleId) return; await store.loadDelivery(task.deliverySampleId); deliveryVisible.value = true }
async function decompose() { decomposeLoading.value = true; try { const result = await store.decomposeProposal(decomposeProposalId.value); generatedTasks.value = result.tasks; refreshRows(); ElMessage.info('AI 已完成任务拆解') } catch { ElMessage.error('AI 任务拆解失败，请稍后重试') } finally { decomposeLoading.value = false } }
onMounted(async () => { if (!store.tasks.length) await store.loadTasks(); if (!store.proposals.length) await store.loadProposals(); if (!store.leads.length) await store.loadLeads({ pageNo: 1, pageSize: 10 }); refreshRows() })
</script>

<style scoped>
.decompose-form { margin-top: 18px; }
.decompose-result { min-height: 130px; padding: 12px; background: #f8fafc; border: 1px solid var(--app-border-color); }
.result-title { margin-bottom: 8px; color: var(--app-text-primary); font-size: 14px; font-weight: 600; }
.generated-task { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--app-border-color); }
.generated-task strong { color: var(--app-text-primary); font-size: 13px; }
.generated-task p { margin: 5px 0 0; color: var(--app-text-regular); font-size: 12px; line-height: 1.6; }
</style>
