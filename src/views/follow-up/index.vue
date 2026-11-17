<template>
  <div>
    <div class="page-toolbar"><div><h1 class="page-title">客户跟进</h1><p class="page-description">管理触达记录、联系内容和下一次跟进动作。</p></div><div class="page-actions"><el-button type="primary" @click="openSelected"><el-icon><MagicStick /></el-icon>生成联系内容</el-button></div></div>
    <ContentWrap>
      <el-form :model="query" inline class="filter-form" label-width="70px">
        <el-form-item label="客户名称"><el-input v-model="query.companyName" clearable placeholder="请输入客户名称" class="w-240px" /></el-form-item>
        <el-form-item label="联系渠道"><el-select v-model="query.channel" clearable placeholder="全部" class="w-150px"><el-option label="邮件" value="邮件" /><el-option label="LinkedIn" value="LinkedIn" /><el-option label="WhatsApp" value="WhatsApp" /></el-select></el-form-item>
        <el-form-item label="跟进状态"><el-select v-model="query.status" clearable placeholder="全部" class="w-140px"><el-option label="待联系" value="待联系" /><el-option label="已联系" value="已联系" /><el-option label="跟进中" value="跟进中" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="filterRows"><el-icon><Search /></el-icon>搜索</el-button><el-button @click="reset"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
    </ContentWrap>
    <ContentWrap>
      <el-table :data="rows" stripe size="small">
        <el-table-column prop="companyName" label="客户名称" min-width="270" />
        <el-table-column prop="contact" label="联系人" min-width="190" />
        <el-table-column prop="channel" label="联系渠道" width="110" />
        <el-table-column prop="lastContact" label="最近联系时间" width="170" />
        <el-table-column prop="nextContact" label="下次跟进" width="150" />
        <el-table-column prop="followUpStatus" label="状态" width="100" align="center"><template #default="{ row }"><el-tag size="small" :type="followUpTagType(row.followUpStatus)">{{ row.followUpStatus }}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center"><template #default="{ row }"><div class="table-actions"><el-button link type="primary" @click="openOutreach(row)">查看内容</el-button><el-button link type="primary" @click="markContacted(row)">标记已联系</el-button></div></template></el-table-column>
      </el-table>
    </ContentWrap>
    <el-drawer v-model="drawerVisible" title="AI 个性化联系内容" size="600px">
      <template v-if="selectedLead">
        <el-descriptions :column="1" border size="small"><el-descriptions-item label="客户名称">{{ selectedLead.companyName }}</el-descriptions-item><el-descriptions-item label="联系人">{{ selectedLead.contact }}</el-descriptions-item><el-descriptions-item label="增长信号">{{ selectedLead.growthSignal }}</el-descriptions-item></el-descriptions>
        <div v-loading="loading" class="mt-18px">
          <template v-if="draft">
            <el-alert title="AI 已根据客户画像和增长信号生成内容，可编辑后再确认。" type="info" :closable="false" />
            <div class="draft-toolbar">
              <el-select v-model="draftChannel" size="small" class="draft-channel" @change="regenerateDraft"><el-option label="邮件" value="邮件" /><el-option label="LinkedIn" value="LinkedIn" /><el-option label="WhatsApp" value="WhatsApp" /></el-select>
              <div class="table-actions"><el-button size="small" @click="saveDraft">保存修改</el-button><el-button size="small" @click="copyContent"><el-icon><CopyDocument /></el-icon>{{ copied ? '已复制' : '复制内容' }}</el-button></div>
            </div>
            <el-input v-if="subjectDraft" v-model="subjectDraft" placeholder="邮件主题" class="mb-10px" />
            <el-input v-model="contentDraft" type="textarea" :rows="14" placeholder="请输入联系内容" />
            <div class="ai-confidence"><el-tag size="small" type="info">AI 置信度 {{ Math.round((draft.confidence || 0.8) * 100) }}%</el-tag><span>建议先人工确认客户事实和承诺内容</span></div>
            <div v-if="draft.rationale?.length" class="rationale-block"><div class="drawer-section-title">生成依据</div><ul class="compact-list"><li v-for="item in draft.rationale" :key="item">{{ item }}</li></ul></div>
            <h3 class="drawer-section-title">建议跟进节奏</h3>
            <div class="follow-up-plan"><div v-for="item in draft.followUpPlan" :key="item.id" class="follow-up-step"><el-checkbox :model-value="item.status === '已完成'" @change="toggleStep(item.id)"><span class="step-day">第 {{ item.dayOffset }} 天</span>{{ item.action }}</el-checkbox><el-tag size="small" type="info">{{ item.channel }}</el-tag></div></div>
            <div class="drawer-actions"><el-button type="primary" size="small" @click="goToProposal"><el-icon><DocumentAdd /></el-icon>基于联系内容生成方案</el-button></div>
          </template>
          <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" />
          <el-empty v-if="!draft && !errorMessage" description="点击生成联系内容" />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument, DocumentAdd, MagicStick, Refresh, Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import ContentWrap from '../../components/ContentWrap.vue'
import { useOverseasStore } from '../../stores/overseas'
import type { Lead } from '../../types/overseas'
import { followUpTagType } from '../../utils/status'

const store = useOverseasStore()
const router = useRouter()
const drawerVisible = ref(false)
const loading = ref(false)
const copied = ref(false)
const errorMessage = ref('')
const selectedLeadId = ref(store.selectedLeadId)
const draftChannel = ref<'邮件' | 'LinkedIn' | 'WhatsApp'>('邮件')
const subjectDraft = ref('')
const contentDraft = ref('')
const query = reactive({ companyName: '', channel: '', status: '' })
const rows = ref<Array<Lead & { channel: string; lastContact: string; nextContact: string }>>([])
const selectedLead = computed(() => store.leads.find((item) => item.id === selectedLeadId.value))
const draft = computed(() => store.outreachMap[selectedLeadId.value])

function buildRows() { rows.value = store.leads.map((lead) => ({ ...lead, channel: store.outreachMap[lead.id]?.channel || (lead.id === 2 ? 'LinkedIn' : '邮件'), lastContact: lead.followUpStatus === '待联系' ? '-' : '2026-10-10 14:20', nextContact: lead.followUpStatus === '待联系' ? '待安排' : '2026-10-15' })) }
function filterRows() { rows.value = rows.value.filter((item) => (!query.companyName || item.companyName.includes(query.companyName)) && (!query.channel || item.channel === query.channel) && (!query.status || item.followUpStatus === query.status)) }
function reset() { Object.assign(query, { companyName: '', channel: '', status: '' }); buildRows() }
function syncDraft() { if (!draft.value) return; draftChannel.value = draft.value.channel; subjectDraft.value = draft.value.subject || ''; contentDraft.value = draft.value.content }
async function openOutreach(row: Lead) {
  selectedLeadId.value = row.id
  store.selectedLeadId = row.id
  errorMessage.value = ''
  drawerVisible.value = true
  if (!draft.value) {
    loading.value = true
    try { await store.generateOutreach(row.id); buildRows(); syncDraft() } catch { errorMessage.value = 'AI 联系内容生成失败，请稍后重试' } finally { loading.value = false }
  } else syncDraft()
}
async function openSelected() { const lead = selectedLead.value || store.leads[0]; if (lead) await openOutreach(lead) }
function markContacted(row: Lead) { row.followUpStatus = '已联系'; const target = store.leads.find((item) => item.id === row.id); if (target) target.followUpStatus = '已联系'; ElMessage.info('已更新跟进状态') }
async function copyContent() { if (!draft.value) return; await navigator.clipboard?.writeText([draft.value.subject, draft.value.content].filter(Boolean).join('\n\n')); copied.value = true; window.setTimeout(() => copied.value = false, 1600) }
function saveDraft() { if (!draft.value) return; store.saveOutreachDraft(selectedLeadId.value, { subject: subjectDraft.value || undefined, content: contentDraft.value }); buildRows(); ElMessage.info('联系内容修改已保存') }
function toggleStep(stepId: string) { store.completeFollowUpStep(selectedLeadId.value, stepId); ElMessage.info('跟进计划已更新') }
async function regenerateDraft() { if (!selectedLead.value) return; loading.value = true; errorMessage.value = ''; try { await store.generateOutreach(selectedLead.value.id, draftChannel.value); syncDraft(); buildRows() } catch { errorMessage.value = '重新生成失败，请稍后重试' } finally { loading.value = false } }
async function goToProposal() { if (!selectedLead.value) return; saveDraft(); try { const proposal = await store.generateProposal(selectedLead.value.id); store.upsertProposal(proposal); drawerVisible.value = false; router.push('/proposals') } catch { ElMessage.error('方案生成失败，请稍后重试') } }
watch(draft, syncDraft, { immediate: true })
onMounted(async () => { if (!store.leads.length) await store.loadLeads({ pageNo: 1, pageSize: 10 }); selectedLeadId.value = store.selectedLeadId; buildRows() })
</script>

<style scoped>
.drawer-section-title { margin: 20px 0 10px; color: var(--app-text-primary); font-size: 14px; font-weight: 600; }
.draft-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 12px 0 10px; }
.draft-channel { width: 130px; }
.ai-confidence { display: flex; align-items: center; gap: 8px; margin-top: 10px; color: var(--app-text-secondary); font-size: 12px; }
.rationale-block { padding-top: 4px; }
.compact-list { margin: 0; padding-left: 18px; color: var(--app-text-regular); line-height: 1.9; }
.drawer-actions { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--app-border-color); }
.follow-up-plan { display: grid; gap: 8px; }
.follow-up-step { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border: 1px solid var(--app-border-color); background: #f8fafc; }
.step-day { display: inline-block; min-width: 48px; color: var(--el-color-primary); font-weight: 600; }
</style>
