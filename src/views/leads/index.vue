<template>
  <div>
    <div class="page-toolbar">
      <div><h1 class="page-title">潜客分析</h1><p class="page-description">从公开企业信号、展会名单和 CRM 中汇总可能需要出海营销的 AI 企业。</p></div>
      <div class="page-actions"><el-button type="primary" @click="openImport"><el-icon><Upload /></el-icon>导入线索</el-button><el-button plain type="primary" @click="loadList"><el-icon><Refresh /></el-icon>刷新列表</el-button></div>
    </div>

    <ContentWrap>
      <el-form :model="query" inline class="filter-form" label-width="70px">
        <el-form-item label="企业名称"><el-input v-model="query.companyName" clearable placeholder="请输入企业名称" class="w-220px" @keyup.enter="loadList" /></el-form-item>
        <el-form-item label="AI 赛道"><el-select v-model="query.aiCategory" clearable placeholder="全部" class="w-150px"><el-option v-for="item in categories" :key="item" :label="item" :value="item" /></el-select></el-form-item>
        <el-form-item label="线索来源"><el-select v-model="query.source" clearable placeholder="全部" class="w-150px"><el-option v-for="item in sources" :key="item" :label="item" :value="item" /></el-select></el-form-item>
        <el-form-item label="优先级"><el-select v-model="query.priority" clearable placeholder="全部" class="w-110px"><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="loadList"><el-icon><Search /></el-icon>搜索</el-button><el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table v-loading="loading" :data="store.leads" stripe size="small" height="calc(100dvh - 360px)" empty-text="暂无线索，请先导入客户">
        <el-table-column type="index" width="55" align="center" />
        <el-table-column prop="companyName" label="AI 企业" min-width="245" show-overflow-tooltip />
        <el-table-column prop="aiCategory" label="AI 赛道" width="135" />
        <el-table-column prop="country" label="总部" width="90" />
        <el-table-column label="线索来源" min-width="145" show-overflow-tooltip><template #default="{ row }"><div>{{ row.source }}</div><small class="table-subtext">{{ row.sourceDetail }}</small></template></el-table-column>
        <el-table-column label="信号" width="70" align="center"><template #default="{ row }"><span class="font-600 text-primary">{{ row.signals.length }}</span></template></el-table-column>
        <el-table-column prop="fitScore" label="匹配度" width="85" align="center"><template #default="{ row }"><span class="font-600 text-primary">{{ row.fitScore }}</span></template></el-table-column>
        <el-table-column prop="priority" label="优先级" width="90" align="center"><template #default="{ row }"><el-tag size="small" :type="priorityTagType(row.priority)">{{ row.priority }}</el-tag></template></el-table-column>
        <el-table-column prop="followUpStatus" label="跟进状态" width="105" align="center"><template #default="{ row }"><el-tag size="small" :type="followUpTagType(row.followUpStatus)">{{ row.followUpStatus }}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="255" fixed="right" align="center"><template #default="{ row }"><div class="table-actions"><el-button link type="primary" @click="openAnalysis(row)">AI 分析</el-button><el-button link type="primary" @click="openOutreach(row)">生成联系内容</el-button><el-button link type="primary" @click="setAsCase(row)">设为案例</el-button></div></template></el-table-column>
      </el-table>
      <div class="mt-12px flex justify-end"><el-pagination v-model:current-page="query.pageNo" v-model:page-size="query.pageSize" background layout="total, sizes, prev, pager, next" :total="store.leadTotal" @change="loadList" /></div>
    </ContentWrap>

    <el-drawer v-model="analysisVisible" title="AI 客户分析" size="520px">
      <template v-if="selectedLead">
        <el-descriptions :column="1" border size="small"><el-descriptions-item label="AI 企业">{{ selectedLead.companyName }}</el-descriptions-item><el-descriptions-item label="联系人">{{ selectedLead.contact }}</el-descriptions-item><el-descriptions-item label="目标市场">{{ selectedLead.targetMarkets.join('、') }}</el-descriptions-item><el-descriptions-item label="来源">{{ selectedLead.source }} · {{ selectedLead.sourceDetail }}</el-descriptions-item></el-descriptions>
        <div v-loading="analysisLoading" class="mt-18px">
          <template v-if="analysis">
            <el-alert :title="`${analysis.priority}优先级 · 建议进入跟进`" type="info" :closable="false" />
            <div class="ai-meta-row"><el-tag size="small" type="info">AI 置信度 {{ Math.round((analysis.confidence || 0.8) * 100) }}%</el-tag><span>基于企业信号、来源和目标市场生成</span></div>
            <h3 class="drawer-section-title">为什么优先跟进</h3><ul class="compact-list"><li v-for="item in analysis.reasons" :key="item">{{ item }}</li></ul>
            <h3 class="drawer-section-title">评分拆解</h3><div class="score-list"><div v-for="item in analysis.scoreSnapshot?.dimensions" :key="item.key" class="score-row"><span>{{ item.key }}</span><el-progress :percentage="item.score" :show-text="false" /><strong>{{ item.score }}</strong></div></div>
            <h3 class="drawer-section-title">判断依据</h3><div class="signal-list"><div v-for="signal in selectedLead.signals" :key="signal.id" class="signal-item"><div><strong>{{ signal.text }}</strong><p>{{ signal.source }} · {{ signal.date }}</p></div><el-tag size="small" type="info">{{ Math.round(signal.weight * 100) }}%</el-tag></div></div>
            <h3 class="drawer-section-title">建议切入角度</h3><p class="drawer-copy">{{ analysis.suggestedAngle }}</p>
            <div class="drawer-actions"><el-button type="primary" size="small" :loading="nextActionLoading" @click="goToOutreach"><el-icon><MagicStick /></el-icon>生成联系内容</el-button><el-button size="small" :loading="nextActionLoading" @click="goToProposal"><el-icon><DocumentAdd /></el-icon>生成服务方案</el-button></div>
          </template>
          <el-alert v-if="analysisError" :title="analysisError" type="error" :closable="false" />
          <el-empty v-if="!analysis && !analysisError" description="正在生成分析结果" />
        </div>
      </template>
    </el-drawer>

    <el-dialog v-model="importVisible" title="导入潜在 AI 企业" width="520px">
      <el-alert title="Demo 使用模拟数据源，真实项目可替换为官网表单、CRM、展会名单或合规的企业公开数据接口。" type="info" :closable="false" />
      <el-form label-width="90px" class="import-form"><el-form-item label="数据来源"><el-select v-model="importSource" class="w-full"><el-option v-for="item in sources" :key="item" :label="item" :value="item" /></el-select></el-form-item><el-form-item label="导入说明"><span class="muted">点击导入后会模拟同步 2 家新企业，随后进入 AI 评分和排序。</span></el-form-item></el-form>
      <template #footer><el-button @click="importVisible = false">取消</el-button><el-button type="primary" :loading="importing" @click="importNow">导入并分析</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentAdd, MagicStick, Refresh, Search, Upload } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import ContentWrap from '../../components/ContentWrap.vue'
import { useOverseasStore } from '../../stores/overseas'
import type { Lead, LeadQuery, LeadSource } from '../../types/overseas'
import { followUpTagType, priorityTagType } from '../../utils/status'

const store = useOverseasStore(); const router = useRouter(); const loading = ref(false); const analysisVisible = ref(false); const analysisLoading = ref(false); const analysisError = ref(''); const nextActionLoading = ref(false); const importVisible = ref(false); const importing = ref(false)
const sources: LeadSource[] = ['官网询盘', '展会名单', 'CRM 导入', '公开企业信息', 'B2B 平台', 'AI 推荐']
const categories = ['AI 客服 SaaS', 'AI 数字人', 'AI 招聘', 'AI 编程工具', 'AI 合同', 'AI 语音', 'AI 视觉质检']
const query = reactive<LeadQuery>({ pageNo: 1, pageSize: 10, companyName: '', country: '', aiCategory: '', source: '', priority: '', followUpStatus: '' }); const importSource = ref<LeadSource>('公开企业信息'); const selectedLeadId = ref(0)
const selectedLead = computed(() => store.leads.find((item) => item.id === selectedLeadId.value)); const analysis = computed(() => selectedLeadId.value ? store.analysisMap[selectedLeadId.value] : undefined)
async function loadList() { loading.value = true; try { await store.loadLeads(query) } finally { loading.value = false } }
function resetQuery() { Object.assign(query, { pageNo: 1, pageSize: 10, companyName: '', country: '', aiCategory: '', source: '', priority: '', followUpStatus: '' }); loadList() }
async function openAnalysis(row: Lead) { selectedLeadId.value = row.id; store.selectedLeadId = row.id; analysisVisible.value = true; analysisError.value = ''; if (!analysis.value) { analysisLoading.value = true; try { await store.analyzeLead(row.id) } catch { analysisError.value = 'AI 分析暂时失败，请稍后重试' } finally { analysisLoading.value = false } } }
async function openOutreach(row: Lead) { nextActionLoading.value = true; try { await store.generateOutreach(row.id); router.push('/follow-up') } catch { ElMessage.error('联系内容生成失败，请稍后重试') } finally { nextActionLoading.value = false } }
async function goToOutreach() { if (!selectedLead.value) return; nextActionLoading.value = true; try { await store.generateOutreach(selectedLead.value.id); analysisVisible.value = false; router.push('/follow-up') } finally { nextActionLoading.value = false } }
async function goToProposal() { if (!selectedLead.value) return; nextActionLoading.value = true; try { const proposal = await store.generateProposal(selectedLead.value.id); store.upsertProposal(proposal); analysisVisible.value = false; router.push('/proposals') } finally { nextActionLoading.value = false } }
async function setAsCase(row: Lead) { await store.setCaseLead(row.id); ElMessage.info(`${row.companyName} 已设为本轮案例`) }
function openImport() { importVisible.value = true }
async function importNow() { importing.value = true; try { const result = await store.importLeads(importSource.value); importVisible.value = false; await loadList(); ElMessage.info(result.length ? `已导入 ${result.length} 家 AI 企业` : '暂无新的模拟线索') } finally { importing.value = false } }
onMounted(loadList)
</script>

<style scoped>
.table-subtext { color: var(--app-text-secondary); font-size: 11px; }
.drawer-section-title { margin: 20px 0 10px; color: var(--app-text-primary); font-size: 14px; font-weight: 600; }
.drawer-copy { margin: 0; color: var(--app-text-regular); line-height: 1.8; }
.compact-list { margin: 0; padding-left: 18px; color: var(--app-text-regular); line-height: 1.9; }
.ai-meta-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: var(--app-text-secondary); font-size: 12px; }
.score-list { display: grid; gap: 9px; }
.score-row { display: grid; grid-template-columns: 72px 1fr 34px; align-items: center; gap: 8px; color: var(--app-text-regular); font-size: 12px; }
.score-row strong { color: var(--app-text-primary); text-align: right; }
.signal-list { display: grid; gap: 8px; }
.signal-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 10px; background: #f8fafc; border: 1px solid var(--app-border-color); }
.signal-item strong { color: var(--app-text-primary); font-size: 12px; font-weight: 500; line-height: 1.6; }
.signal-item p { margin: 4px 0 0; color: var(--app-text-secondary); font-size: 11px; }
.drawer-actions { display: flex; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--app-border-color); }
.import-form { margin-top: 20px; }
</style>
