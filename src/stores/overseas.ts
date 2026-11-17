import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '../api/client'
import type { DeliverySample, Lead, LeadAnalysis, LeadQuery, LeadSource, MarketingCase, MarketingTask, OutreachChannel, OutreachDraft, Proposal, ProposalStatus, Review, ReviewMetrics, TaskDecomposition, TaskStatus } from '../types/overseas'

export const useOverseasStore = defineStore('overseas', () => {
  const currentCase = ref<MarketingCase>()
  const leads = ref<Lead[]>([])
  const leadTotal = ref(0)
  const selectedLeadId = ref(1)
  const analysisMap = ref<Record<number, LeadAnalysis>>({})
  const outreachMap = ref<Record<number, OutreachDraft>>({})
  const proposals = ref<Proposal[]>([])
  const selectedProposal = ref<Proposal>()
  const tasks = ref<MarketingTask[]>([])
  const lastDecomposition = ref<TaskDecomposition>()
  const selectedDelivery = ref<DeliverySample>()
  const metrics = ref<ReviewMetrics>()
  const review = ref<Review>()

  const selectedLead = computed(() => leads.value.find((item) => item.id === selectedLeadId.value))
  const selectedAnalysis = computed(() => analysisMap.value[selectedLeadId.value])
  const selectedOutreach = computed(() => outreachMap.value[selectedLeadId.value])

  async function loadCase() { currentCase.value = await api.getCase() }
  async function loadLeads(query: LeadQuery) { const result = await api.getLeads(query); leads.value = result.list; leadTotal.value = result.total }
  async function importLeads(source: LeadSource) { const imported = await api.discoverLeads(source); if (imported.length) { const existing = new Set(leads.value.map((item) => item.id)); leads.value = [...leads.value, ...imported.filter((item) => !existing.has(item.id))].sort((a, b) => b.fitScore - a.fitScore); leadTotal.value += imported.length }; return imported }
  async function setCaseLead(leadId: number) { selectedLeadId.value = leadId; currentCase.value = await api.setCaseLead(currentCase.value?.id || 1, leadId) }
  async function analyzeLead(leadId = selectedLeadId.value) { selectedLeadId.value = leadId; analysisMap.value[leadId] = await api.analyzeLead(leadId); return analysisMap.value[leadId] }
  async function generateOutreach(leadId = selectedLeadId.value, channel?: OutreachChannel) { selectedLeadId.value = leadId; outreachMap.value[leadId] = await api.generateOutreach(leadId, channel); currentCase.value && (currentCase.value.stage = '首次触达'); return outreachMap.value[leadId] }
  function saveOutreachDraft(leadId: number, patch: Partial<OutreachDraft>) { const current = outreachMap.value[leadId]; if (current) outreachMap.value[leadId] = { ...current, ...patch } }
  function completeFollowUpStep(leadId: number, stepId: string) { const current = outreachMap.value[leadId]; if (!current) return; current.followUpPlan = current.followUpPlan.map((step) => step.id === stepId ? { ...step, status: step.status === '已完成' ? '未开始' : '已完成', doneAt: step.status === '已完成' ? undefined : new Date().toISOString().slice(0, 10) } : step) }
  async function loadProposals() { proposals.value = await api.getProposals() }
  async function generateProposal(leadId = selectedLeadId.value) { selectedLeadId.value = leadId; selectedProposal.value = await api.generateProposal(leadId); currentCase.value && (currentCase.value.stage = '方案确认'); return selectedProposal.value }
  function upsertProposal(proposal: Proposal) { const index = proposals.value.findIndex((item) => item.id === proposal.id); if (index >= 0) proposals.value[index] = proposal; else proposals.value.push(proposal); selectedProposal.value = proposal }
  async function updateProposalStatus(proposalId: number, status: ProposalStatus) { await api.updateProposalStatus(proposalId, status); const target = proposals.value.find((item) => item.id === proposalId); if (target) target.status = status; if (selectedProposal.value?.id === proposalId) selectedProposal.value.status = status; if (status === '执行中' && currentCase.value) currentCase.value.stage = '执行交付' }
  async function loadTasks() { tasks.value = await api.getTasks() }
  async function updateTaskStatus(taskId: number, status: TaskStatus) { await api.updateTaskStatus(taskId, status); const target = tasks.value.find((item) => item.id === taskId); if (target) target.status = status; if (status === '进行中' && currentCase.value) currentCase.value.stage = '执行交付' }
  async function decomposeProposal(proposalId: number) { const result = await api.decomposeTasks(proposalId); lastDecomposition.value = result; const existingIds = new Set(tasks.value.map((item) => item.id)); tasks.value = [...tasks.value, ...result.tasks.filter((item) => !existingIds.has(item.id))]; return result }
  async function loadDelivery(sampleId: number) { selectedDelivery.value = await api.getDelivery(sampleId); return selectedDelivery.value }
  async function loadMetrics() { metrics.value = await api.getMetrics() }
  async function generateReview() { review.value = await api.generateReview(); if (currentCase.value) currentCase.value.stage = '数据复盘'; return review.value }
  async function generateNextRound() { const result = await api.generateNextRound(currentCase.value?.id || 1); currentCase.value = result.case; tasks.value = [...tasks.value, ...result.tasks]; return result }
  async function bootstrap() { await Promise.all([loadCase(), loadLeads({ pageNo: 1, pageSize: 20 }), loadProposals(), loadTasks(), loadMetrics()]) }

  return { currentCase, leads, leadTotal, selectedLeadId, selectedLead, analysisMap, selectedAnalysis, outreachMap, selectedOutreach, proposals, selectedProposal, tasks, lastDecomposition, selectedDelivery, metrics, review, loadCase, loadLeads, importLeads, setCaseLead, analyzeLead, generateOutreach, saveOutreachDraft, completeFollowUpStep, loadProposals, generateProposal, upsertProposal, updateProposalStatus, loadTasks, updateTaskStatus, decomposeProposal, loadDelivery, loadMetrics, generateReview, generateNextRound, bootstrap }
})
