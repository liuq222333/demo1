import type { Lead, LeadAnalysis, LeadQuery, MarketingCase, MarketingTask, OutreachChannel, OutreachDraft, Proposal, ProposalStatus, Review, ReviewMetrics, TaskDecomposition, DeliverySample, LeadSource } from '../types/overseas'

export interface OverseasApi {
  getCase(): Promise<MarketingCase>
  setCaseLead(caseId: number, leadId: number): Promise<MarketingCase>
  getLeads(query: LeadQuery): Promise<{ list: Lead[]; total: number }>
  discoverLeads(source: LeadSource): Promise<Lead[]>
  analyzeLead(leadId: number): Promise<LeadAnalysis>
  generateOutreach(leadId: number, channel?: OutreachChannel): Promise<OutreachDraft>
  getProposals(): Promise<Proposal[]>
  generateProposal(leadId: number): Promise<Proposal>
  updateProposalStatus(proposalId: number, status: ProposalStatus): Promise<Proposal | undefined>
  getTasks(): Promise<MarketingTask[]>
  updateTaskStatus(taskId: number, status: MarketingTask['status']): Promise<MarketingTask | undefined>
  decomposeTasks(proposalId: number): Promise<TaskDecomposition>
  getDelivery(sampleId: number): Promise<DeliverySample | undefined>
  getMetrics(): Promise<ReviewMetrics>
  generateReview(): Promise<Review>
  generateNextRound(caseId: number): Promise<{ case: MarketingCase; tasks: MarketingTask[] }>
}
