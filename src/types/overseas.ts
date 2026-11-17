export type LeadPriority = '高' | '中' | '低'
export type LeadFollowUpStatus = '待联系' | '已联系' | '跟进中' | '已转化'
export type TaskStatus = '待开始' | '进行中' | '已完成' | '已逾期'
export type ProposalStatus = '草稿' | '待确认' | '执行中' | '已完成'
export type OutreachChannel = '邮件' | 'LinkedIn' | 'WhatsApp'
export type LeadSource = '官网询盘' | '展会名单' | 'CRM 导入' | '公开企业信息' | 'B2B 平台' | 'AI 推荐'
export type CaseStage = '待选定' | '潜客分析' | '首次触达' | '方案确认' | '执行交付' | '数据复盘' | '进入下一轮'
export type MetricKey = 'impressions' | 'clicks' | 'leads' | 'qualifiedLeads' | 'replyRate' | 'contentCount' | 'cpl'
export type MetricDirection = 'up' | 'down'

export interface LeadSignal {
  id: string
  type: '融资' | '招聘' | '官网' | '内容' | '渠道' | '活动'
  text: string
  source: string
  date: string
  weight: number
}

export interface ScoreDimension {
  key: '出海意图' | '付费能力' | '服务匹配' | '决策可达' | '时机'
  score: number
  note: string
}

export interface ScoreBreakdown {
  total: number
  dimensions: ScoreDimension[]
}

export interface MarketingCase {
  id: number
  leadId: number
  name: string
  description: string
  market: string
  targetMarkets: string[]
  goal: string
  owner: string
  status: '进行中' | '已暂停' | '已结项'
  stage: CaseStage
  round: number
  startDate: string
}

export interface Lead {
  id: number
  companyName: string
  country: string
  city: string
  aiCategory: string
  companySize: string
  fundingStage: string
  overseasIntent: string
  targetMarkets: string[]
  source: LeadSource
  sourceDetail: string
  capturedAt: string
  signals: LeadSignal[]
  tags: string[]
  fitScore: number
  score: ScoreBreakdown
  priority: LeadPriority
  followUpStatus: LeadFollowUpStatus
  owner: string
  contact: string
  growthSignal: string
  createTime: string
}

export interface LeadQuery {
  companyName?: string
  country?: string
  aiCategory?: string
  source?: LeadSource | ''
  priority?: LeadPriority | ''
  followUpStatus?: LeadFollowUpStatus | ''
  pageNo: number
  pageSize: number
}

export interface LeadAnalysis {
  leadId: number
  priority: LeadPriority
  fitScore: number
  confidence: number
  reasons: string[]
  painPoints: string[]
  suggestedAngle: string
  evidence: string[]
  nextActions: string[]
  scoreSnapshot?: ScoreBreakdown
}

export interface FollowUpStep {
  id: string
  dayOffset: number
  channel: OutreachChannel
  action: string
  template: string
  status: '未开始' | '已完成' | '已跳过'
  doneAt?: string
}

export interface OutreachDraft {
  leadId: number
  channel: OutreachChannel
  subject?: string
  content: string
  followUpPlan: FollowUpStep[]
  rationale?: string[]
  confidence?: number
}

export interface MetricTarget {
  key: MetricKey
  label: string
  unit: string
  baseline: number
  target: number
  direction: MetricDirection
}

export interface Proposal {
  id: number
  leadId: number
  round: number
  situation: string
  goals: string[]
  strategy: string[]
  deliverables: string[]
  timeline: string
  targetMetrics: MetricTarget[]
  status: ProposalStatus
  version: number
  createTime: string
  confidence?: number
  assumptions?: string[]
  riskNotes?: string[]
}

export type DeliveryBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'email'; variant: string; subject: string; body: string }
  | { kind: 'kv'; items: Array<{ label: string; value: string }> }
  | { kind: 'metric'; items: Array<{ label: string; value: string; hint?: string }> }

export interface DeliverySample {
  id: number
  taskId: number
  type: '邮件序列' | '内容清单' | '问题地图' | '周报' | '线索名单'
  title: string
  createdAt: string
  owner: string
  summary: string
  blocks: DeliveryBlock[]
  rawMarkdown: string
}

export interface MarketingTask {
  id: number
  proposalId: number
  title: string
  description: string
  owner: string
  dueDate: string
  status: TaskStatus
  deliverable: string
  source?: 'AI 拆解' | 'AI 复盘' | '人工'
  deliverySampleId?: number
  round: number
  stage: '执行交付' | '数据复盘' | '进入下一轮'
}

export interface TaskDecomposition {
  proposalId: number
  confidence: number
  summary: string
  tasks: MarketingTask[]
}

export interface ReviewMetrics {
  caseId: number
  round: number
  values: Record<MetricKey, number>
  channelData: Array<{ channel: string; leads: number; qualityScore: number }>
}

export interface MetricComparison {
  key: MetricKey
  label: string
  unit: string
  baseline: number
  target: number
  actual: number
  delta: number
  achieved: boolean
  note: string
}

export interface Improvement {
  id: string
  title: string
  detail: string
  expectedMetric: MetricKey
  expectedDelta: number
  convertedTaskIds: number[]
}

export interface Review {
  caseId: number
  round: number
  summary: string
  comparisons: MetricComparison[]
  achievedCount: number
  totalCount: number
  insights: string[]
  improvements: Improvement[]
  nextAction: string
  confidence?: number
  evidence?: string[]
}
