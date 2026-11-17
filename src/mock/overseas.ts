import type { DeliverySample, Lead, LeadAnalysis, MarketingCase, MarketingTask, OutreachDraft, Proposal, Review, ReviewMetrics, ScoreBreakdown } from '../types/overseas'
import { metricCatalog, metricTarget } from '../utils/metrics'

export const marketingCase: MarketingCase = {
  id: 1,
  leadId: 1,
  name: '星澜智能 · 东南亚 GTM 验证',
  description: '面向跨境电商的 AI 客服 SaaS，正在准备进入东南亚市场。',
  market: '东南亚',
  targetMarkets: ['新加坡', '马来西亚', '印度尼西亚'],
  goal: '90 天验证第一批高质量销售线索',
  owner: 'Lena Wang',
  status: '进行中',
  stage: '潜客分析',
  round: 1,
  startDate: '2026-10-09',
}

function score(total: number, values: Array<[ScoreBreakdown['dimensions'][number]['key'], number, string]>): ScoreBreakdown {
  return { total, dimensions: values.map(([key, value, note]) => ({ key, score: value, note })) }
}

const baseSignals = (id: number, items: Lead['signals']): Lead['signals'] => items.map((item, index) => ({ ...item, id: `${id}-${index + 1}` }))

export const leads: Lead[] = [
  {
    id: 1, companyName: '星澜智能 StarWave AI', country: '新加坡', city: 'Singapore', aiCategory: 'AI 客服 SaaS', companySize: '160 人', fundingStage: 'A 轮',
    overseasIntent: '准备进入东南亚，正在招聘海外销售', targetMarkets: ['新加坡', '马来西亚', '印度尼西亚'], source: '公开企业信息', sourceDetail: '官网 / LinkedIn 招聘 / 公开融资信息', capturedAt: '2026-10-08',
    signals: baseSignals(1, [
      { id: '', type: '融资', text: '2026 年 9 月完成 800 万美元 A 轮融资', source: '公开融资信息', date: '2026-09-18', weight: 0.24 },
      { id: '', type: '招聘', text: '正在招聘东南亚海外销售负责人', source: 'LinkedIn 招聘', date: '2026-10-02', weight: 0.28 },
      { id: '', type: '官网', text: '官网已有英文版，但缺少本地市场内容', source: '企业官网', date: '2026-10-05', weight: 0.2 },
      { id: '', type: '活动', text: '报名参加新加坡电商展', source: '展会公开名单', date: '2026-10-06', weight: 0.16 },
    ]),
    tags: ['高增长', '多语客服', '东南亚'], fitScore: 92, score: score(92, [['出海意图', 96, '已有目标市场和招聘动作'], ['付费能力', 88, '刚完成 A 轮融资'], ['服务匹配', 95, '客服和线索承接场景高度匹配'], ['决策可达', 86, '可通过海外销售负责人切入'], ['时机', 94, '融资和展会带来明确窗口']]), priority: '高', followUpStatus: '待联系', owner: 'Lena Wang', contact: 'Lena Wang · Head of Growth', growthSignal: '融资后正在补齐海外销售与本地化承接能力，需求窗口明确。', createTime: '2026-10-08 09:24:18',
  },
  {
    id: 2, companyName: '数镜科技 MirrorMind', country: '中国', city: '深圳', aiCategory: 'AI 数字人', companySize: '90 人', fundingStage: 'B 轮',
    overseasIntent: '已有英文产品页，正在测试中东市场', targetMarkets: ['阿联酋', '沙特阿拉伯'], source: '展会名单', sourceDetail: 'GITEX 展会报名名单', capturedAt: '2026-10-07',
    signals: baseSignals(2, [
      { id: '', type: '活动', text: '报名参加 GITEX Global，并开放海外演示预约', source: '展会名单', date: '2026-10-03', weight: 0.22 },
      { id: '', type: '官网', text: '英文产品页已上线，阿拉伯语内容尚未建立', source: '企业官网', date: '2026-10-04', weight: 0.18 },
      { id: '', type: '招聘', text: '招聘海外渠道经理，区域暂未明确', source: '招聘公开信息', date: '2026-09-28', weight: 0.16 },
    ]),
    tags: ['数字人', '中东试水', '渠道型'], fitScore: 86, score: score(86, [['出海意图', 88, '有展会和演示预约动作'], ['付费能力', 91, 'B 轮公司预算相对明确'], ['服务匹配', 84, '需要内容和渠道承接'], ['决策可达', 73, '海外负责人尚未明确'], ['时机', 85, '展会临近，窗口较短']]), priority: '中', followUpStatus: '已联系', owner: 'Nadia Chen', contact: 'Mina Qiao · VP Marketing', growthSignal: '中东展会窗口临近，但区域负责人和内容本地化仍不完整。', createTime: '2026-10-07 15:40:02',
  },
  {
    id: 3, companyName: '灵犀招聘 LumenHire', country: '中国', city: '杭州', aiCategory: 'AI 招聘', companySize: '65 人', fundingStage: 'A 轮',
    overseasIntent: '已有海外试点客户，准备复制到日本', targetMarkets: ['日本'], source: 'CRM 导入', sourceDetail: '历史咨询客户 · 2026 Q3', capturedAt: '2026-10-05',
    signals: baseSignals(3, [
      { id: '', type: '渠道', text: '已有 2 家海外试点客户，续约反馈较好', source: 'CRM 历史记录', date: '2026-09-25', weight: 0.25 },
      { id: '', type: '招聘', text: '招聘日语内容运营，计划建立本地内容能力', source: '招聘公开信息', date: '2026-10-01', weight: 0.25 },
      { id: '', type: '内容', text: '持续发布跨境招聘案例，但缺少日语落地页', source: 'LinkedIn 内容', date: '2026-10-04', weight: 0.18 },
    ]),
    tags: ['招聘 SaaS', '已有试点', '日本市场'], fitScore: 81, score: score(81, [['出海意图', 84, '已有海外客户和明确复制目标'], ['付费能力', 78, 'A 轮且团队规模较小'], ['服务匹配', 86, '内容和线索转化需求明显'], ['决策可达', 90, '来自历史咨询记录'], ['时机', 74, '日语团队仍在搭建']]), priority: '中', followUpStatus: '跟进中', owner: 'Marcus Lee', contact: 'Rina Zhou · Growth Lead', growthSignal: '已有海外试点，正在补齐日语内容和获客承接。', createTime: '2026-10-05 11:18:36',
  },
  {
    id: 4, companyName: '铸码 CodeForge AI', country: '中国', city: '北京', aiCategory: 'AI 编程工具', companySize: '220 人', fundingStage: 'B 轮',
    overseasIntent: '产品已上线欧美，正在寻找开发者增长渠道', targetMarkets: ['美国', '英国', '德国'], source: 'B2B 平台', sourceDetail: 'Product Hunt / G2 企业线索', capturedAt: '2026-10-02',
    signals: baseSignals(4, [
      { id: '', type: '渠道', text: '已有海外产品评分和开发者试用流量', source: 'G2 公开页面', date: '2026-09-30', weight: 0.22 },
      { id: '', type: '内容', text: '技术内容更新频繁，但缺少行业解决方案页面', source: '企业博客', date: '2026-10-01', weight: 0.19 },
      { id: '', type: '招聘', text: '招聘 Developer Relations 负责人', source: 'LinkedIn 招聘', date: '2026-09-27', weight: 0.2 },
    ]),
    tags: ['开发者工具', '欧美市场', '内容增长'], fitScore: 79, score: score(79, [['出海意图', 93, '产品已在海外上线'], ['付费能力', 92, 'B 轮且团队规模较大'], ['服务匹配', 76, '需要开发者内容和增长'], ['决策可达', 68, '决策链较长'], ['时机', 78, '正在补增长岗位']]), priority: '中', followUpStatus: '待联系', owner: 'Lena Wang', contact: 'Evan Guo · Product Marketing', growthSignal: '海外产品已有基础流量，但缺少可复制的行业内容和开发者增长机制。', createTime: '2026-10-02 10:40:11',
  },
  {
    id: 5, companyName: '简策 DocPilot', country: '中国', city: '上海', aiCategory: 'AI 合同', companySize: '42 人', fundingStage: 'Seed',
    overseasIntent: '正在评估是否以英文市场作为第一站', targetMarkets: ['澳大利亚', '新西兰'], source: 'AI 推荐', sourceDetail: '基于融资、英文官网和招聘信号推荐', capturedAt: '2026-09-29',
    signals: baseSignals(5, [
      { id: '', type: '官网', text: '英文官网已上线，产品案例仍以中文为主', source: '企业官网', date: '2026-09-26', weight: 0.16 },
      { id: '', type: '招聘', text: '创始团队正在寻找海外顾问', source: '招聘公开信息', date: '2026-09-28', weight: 0.18 },
    ]),
    tags: ['合同智能', '早期团队', '待验证'], fitScore: 68, score: score(68, [['出海意图', 67, '仍在评估阶段'], ['付费能力', 56, 'Seed 阶段预算有限'], ['服务匹配', 76, '需要英文内容验证'], ['决策可达', 94, '创始团队可直接沟通'], ['时机', 61, '尚未形成明确市场计划']]), priority: '低', followUpStatus: '待联系', owner: 'Nadia Chen', contact: 'Yuki Sun · Co-founder', growthSignal: '英文基础已具备，但目标市场和预算尚未确认，适合低成本验证。', createTime: '2026-09-29 13:20:45',
  },
]

const discoveryPool: Lead[] = [
  {
    id: 6, companyName: '语航 VoiceHarbor', country: '中国', city: '厦门', aiCategory: 'AI 语音', companySize: '75 人', fundingStage: 'A 轮', overseasIntent: '准备进入拉美市场', targetMarkets: ['墨西哥', '巴西'], source: 'AI 推荐', sourceDetail: '模拟公开企业信号池', capturedAt: '2026-10-12', signals: baseSignals(6, [{ id: '', type: '融资', text: '完成新一轮融资，开始招聘海外增长岗位', source: '公开融资信息', date: '2026-10-10', weight: 0.22 }, { id: '', type: '招聘', text: '招聘西班牙语内容运营', source: '招聘公开信息', date: '2026-10-11', weight: 0.24 }]), tags: ['语音 AI', '拉美市场'], fitScore: 77, score: score(77, [['出海意图', 82, '已出现本地化招聘动作'], ['付费能力', 75, 'A 轮预算可验证'], ['服务匹配', 79, '需要本地内容和渠道'], ['决策可达', 68, '负责人尚未明确'], ['时机', 80, '招聘动作刚发生']]), priority: '中', followUpStatus: '待联系', owner: 'Lena Wang', contact: 'Kai Wu · Growth Manager', growthSignal: '正在补西班牙语增长能力，适合从拉美内容试点切入。', createTime: '2026-10-12 09:12:00' },
  {
    id: 7, companyName: '视界审阅 Visionary Review', country: '中国', city: '成都', aiCategory: 'AI 视觉质检', companySize: '110 人', fundingStage: 'A 轮', overseasIntent: '已有海外制造业客户，想拓展渠道', targetMarkets: ['越南', '泰国'], source: 'B2B 平台', sourceDetail: '模拟 B2B 企业目录', capturedAt: '2026-10-12', signals: baseSignals(7, [{ id: '', type: '渠道', text: '已有越南制造业客户案例', source: 'B2B 企业目录', date: '2026-10-09', weight: 0.24 }, { id: '', type: '活动', text: '报名东南亚制造业数字化论坛', source: '活动名单', date: '2026-10-10', weight: 0.18 }]), tags: ['视觉质检', '制造业', '东南亚'], fitScore: 74, score: score(74, [['出海意图', 79, '有客户案例和活动动作'], ['付费能力', 76, 'A 轮且客单价较高'], ['服务匹配', 73, '需要行业内容和渠道'], ['决策可达', 70, '需要确认海外负责人'], ['时机', 77, '活动窗口较近']]), priority: '中', followUpStatus: '待联系', owner: 'Marcus Lee', contact: 'Miao Chen · Overseas Sales', growthSignal: '已有海外制造业客户案例，下一步是扩大区域渠道覆盖。', createTime: '2026-10-12 09:20:00' },
]

export const analyses: Record<number, LeadAnalysis> = Object.fromEntries(leads.map((lead) => [lead.id, {
  leadId: lead.id, priority: lead.priority, fitScore: lead.fitScore, confidence: Math.min(0.94, lead.fitScore / 100 + 0.01),
  reasons: [lead.growthSignal, `当前来源为${lead.source}，可追溯到${lead.sourceDetail}。`, `目标市场为${lead.targetMarkets.join('、')}，与${lead.aiCategory}的出海阶段匹配。`],
  painPoints: ['本地化内容承接不足', '销售线索缺少分层', '缺少稳定的海外增长节奏'], suggestedAngle: `先围绕${lead.targetMarkets[0]}制作一个低承诺试点，把${lead.aiCategory}的核心场景转成可验证的获客路径。`, evidence: lead.signals.map((item) => `${item.source}：${item.text}`), nextActions: ['生成英文首封联系内容', '确认目标市场和试点基线', '生成 4 周服务方案'], scoreSnapshot: lead.score,
}]))

function followUpPlan(channel: '邮件' | 'LinkedIn', offsets: number[]): OutreachDraft['followUpPlan'] {
  return offsets.map((dayOffset, index) => ({ id: `step-${dayOffset}`, dayOffset, channel, action: index === 0 ? '发送首次个性化触达' : index === 1 ? '补充一个与客户场景相关的试点思路' : '确认是否安排一次短沟通', template: '', status: '未开始' }))
}

export const outreachDrafts: Record<number, OutreachDraft> = Object.fromEntries(leads.map((lead) => [lead.id, {
  leadId: lead.id, channel: lead.id === 2 ? 'LinkedIn' : '邮件', subject: `A practical first step for ${lead.companyName}'s overseas growth`,
  content: `Hi ${lead.contact.split(' · ')[0]},\n\nI noticed that ${lead.companyName} is exploring ${lead.targetMarkets[0]} and building the next stage of its overseas growth. When a new market opens, the first challenge is usually turning local interest into a clear sales conversation.\n\nWe help AI teams turn one market signal into a small, measurable growth pilot. Would a 20-minute conversation next week be useful?\n\nBest,\nLena`, followUpPlan: followUpPlan(lead.id === 2 ? 'LinkedIn' : '邮件', [1, 4, 9]), rationale: [`使用${lead.source}中的公开信号作为开场依据`, `把${lead.aiCategory}在${lead.targetMarkets[0]}的首个场景收敛成低承诺试点`], confidence: Math.min(0.92, lead.fitScore / 100),
}]))

export const proposals: Record<number, Proposal> = {
  1: {
    id: 1, leadId: 1, round: 1, situation: '星澜智能完成 A 轮融资并开始招聘东南亚海外销售，但官网和客服内容仍以英文为主，缺少本地化线索承接。',
    goals: ['90 天内验证东南亚第一批高质量销售线索', '建立英语、马来语的首轮内容和咨询承接口径', '沉淀一套可复制的海外线索分层方法'], strategy: ['以新加坡站点作为首个试点，建立客户问题和指标基线', '围绕跨境电商客服提速场景制作本地化内容', '每周复盘渠道、问题类型和销售接手率'], deliverables: ['东南亚客户问题地图', '英文与马来语高频问答包', 'LinkedIn 定向内容 8 条', '每周线索质量周报'], timeline: '4 周试点 · 每周一次复盘', targetMetrics: [metricTarget('impressions', 0, 40000), metricTarget('clicks', 0, 1600), metricTarget('leads', 0, 60), metricTarget('qualifiedLeads', 0, 20), metricTarget('replyRate', 8, 18), metricTarget('contentCount', 0, 8), metricTarget('cpl', 80, 50)], status: '执行中', version: 1, createTime: '2026-10-09 10:30:00', confidence: 0.91, assumptions: ['客户可提供一个区域站点的客服基线数据', '试点期间有明确业务负责人参与复盘'], riskNotes: ['如果站点访问量不足，短周期线索样本可能不足']
  },
}

export const tasks: MarketingTask[] = [
  { id: 1, proposalId: 1, title: '完成东南亚客户问题地图', description: '整理目标客户常见问题，标注语言、意图和销售价值。', owner: 'Lena Wang', dueDate: '2026-10-14', status: '已完成', deliverable: '客户问题地图 v1.0', source: '人工', deliverySampleId: 1, round: 1, stage: '执行交付' },
  { id: 2, proposalId: 1, title: '搭建英文与马来语关键词表', description: '将客服场景拆成获客词、问题词和高意向采购词。', owner: 'Nadia Chen', dueDate: '2026-10-16', status: '已完成', deliverable: '关键词表 · 86 个词条', source: '人工', deliverySampleId: 2, round: 1, stage: '执行交付' },
  { id: 3, proposalId: 1, title: '制作 LinkedIn 定向内容包', description: '围绕客服提速和销售线索分层输出 8 条内容。', owner: 'Lena Wang', dueDate: '2026-10-21', status: '进行中', deliverable: '内容包 · 4 / 8 条', source: '人工', deliverySampleId: 3, round: 1, stage: '执行交付' },
  { id: 4, proposalId: 1, title: '输出第一版线索质量周报', description: '汇总渠道、问题类型和销售接手情况，给出下一周建议。', owner: 'Marcus Lee', dueDate: '2026-10-24', status: '待开始', deliverable: '客户周报 · 待生成', source: '人工', deliverySampleId: 4, round: 1, stage: '执行交付' },
]

export const deliveries: Record<number, DeliverySample> = {
  1: { id: 1, taskId: 1, type: '问题地图', title: '东南亚客户问题地图 v1.0', createdAt: '2026-10-14', owner: 'Lena Wang', summary: '按国家、语言、意图和销售价值整理 3 个市场的高频问题。', blocks: [{ kind: 'table', headers: ['市场', '语言', '高频问题', '意图', '销售价值'], rows: [['新加坡', '英语', '如何缩短客服首响？', '效率评估', '高'], ['马来西亚', '英语 / 马来语', '夜间咨询如何分流？', '方案咨询', '高'], ['印度尼西亚', '英语', '是否支持多语言知识库？', '产品了解', '中']] }, { kind: 'list', items: ['优先建立英语与马来语 FAQ', '高意向问题进入销售人工接管', '每周按国家复盘问题变化'] }], rawMarkdown: '# 东南亚客户问题地图 v1.0\n\n| 市场 | 语言 | 高频问题 | 意图 | 销售价值 |\n|---|---|---|---|---|\n| 新加坡 | 英语 | 如何缩短客服首响？ | 效率评估 | 高 |\n| 马来西亚 | 英语 / 马来语 | 夜间咨询如何分流？ | 方案咨询 | 高 |' },
  2: { id: 2, taskId: 2, type: '内容清单', title: 'LinkedIn 定向内容包 · 8 条', createdAt: '2026-10-18', owner: 'Nadia Chen', summary: '围绕东南亚跨境电商客服场景设计首轮内容主题。', blocks: [{ kind: 'list', ordered: true, items: ['跨境站点增长后，客服首响为什么先出问题', '英语和马来语咨询如何统一销售口径', '用一个区域站点验证 30 天客服自动化', '高意向咨询的 3 个识别信号', '夜间咨询如何进入第二天销售队列', '客服数据如何帮助销售判断市场优先级', '东南亚电商团队的多语言 FAQ 框架', '从内容互动到销售线索的交接清单'] }], rawMarkdown: '# LinkedIn 定向内容包\n\n1. 跨境站点增长后，客服首响为什么先出问题\n2. 英语和马来语咨询如何统一销售口径\n3. 用一个区域站点验证 30 天客服自动化' },
  3: { id: 3, taskId: 3, type: '邮件序列', title: '首封触达邮件序列', createdAt: '2026-10-20', owner: 'Lena Wang', summary: '基于招聘、融资和官网信号生成 3 个低承诺触达版本。', blocks: [{ kind: 'email', variant: '价值型', subject: 'A practical first step for StarWave AI’s SEA growth', body: 'Hi Lena,\n\nI noticed StarWave AI is building its Southeast Asia sales motion. We help AI teams turn one market signal into a measurable first growth pilot.\n\nWould a 20-minute conversation next week be useful?' }, { kind: 'email', variant: '案例型', subject: 'A 30-day pilot for multilingual customer response', body: 'Hi Lena,\n\nFor teams entering a new market, multilingual response and lead routing are often the first operational gaps. We can start with one storefront and review the result after 30 days.' }, { kind: 'email', variant: '低承诺型', subject: 'Comparing notes on your overseas growth workflow', body: 'Hi Lena,\n\nI am collecting notes from AI companies preparing for Southeast Asia. Would you be open to a short exchange on your current customer response workflow?' }], rawMarkdown: '# 首封触达邮件序列\n\n## 价值型\n**Subject:** A practical first step for StarWave AI’s SEA growth\n\nHi Lena,\n\nI noticed StarWave AI is building its Southeast Asia sales motion.' },
  4: { id: 4, taskId: 4, type: '周报', title: '第一版线索质量周报', createdAt: '2026-10-24', owner: 'Marcus Lee', summary: '比较三个渠道的线索量与质量，为下一轮预算分配提供依据。', blocks: [{ kind: 'metric', items: [{ label: '有效线索', value: '72 条', hint: '目标 60 条' }, { label: '合格线索', value: '19 条', hint: '目标 20 条' }, { label: '回复率', value: '15%', hint: '目标 18%' }] }, { kind: 'table', headers: ['渠道', '线索数', '质量评分', '判断'], rows: [['LinkedIn 定向', '31', '86', '优先扩大'], ['行业内容', '24', '74', '继续本地化'], ['搜索广告', '17', '52', '降低预算']] }], rawMarkdown: '# 第一版线索质量周报\n\n| 指标 | 实际 | 目标 |\n|---|---:|---:|\n| 有效线索 | 72 | 60 |\n| 合格线索 | 19 | 20 |\n| 回复率 | 15% | 18% |' },
}

export const metrics: ReviewMetrics = { caseId: 1, round: 1, values: { impressions: 48200, clicks: 1876, leads: 72, qualifiedLeads: 19, replyRate: 15, contentCount: 8, cpl: 42 }, channelData: [{ channel: 'LinkedIn 定向', leads: 31, qualityScore: 86 }, { channel: '行业内容', leads: 24, qualityScore: 74 }, { channel: '搜索广告', leads: 17, qualityScore: 52 }] }

export const review: Review = {
  caseId: 1, round: 1, summary: '本轮 7 项指标中有 5 项达成。有效线索、内容产出和单条线索成本表现优于目标，但销售合格线索和触达回复率仍有提升空间。', achievedCount: 5, totalCount: 7,
  comparisons: [
    ['impressions', 48200, '高于目标'], ['clicks', 1876, '高于目标'], ['leads', 72, '高于目标'], ['qualifiedLeads', 19, '低于目标 1 条'], ['replyRate', 15, '低于目标 3 个百分点'], ['contentCount', 8, '达到目标'], ['cpl', 42, '低于目标，效率更好'],
  ].map(([key, actual, note]) => { const target = proposals[1].targetMetrics.find((item) => item.key === key)!; const achieved = key === 'cpl' ? Number(actual) <= target.target : Number(actual) >= target.target; return { key: key as keyof typeof metricCatalog, label: target.label, unit: target.unit, baseline: target.baseline, target: target.target, actual: Number(actual), delta: Number(actual) - target.target, achieved, note: String(note) } }),
  insights: ['LinkedIn 定向线索质量评分达到 86，明确行业场景比泛化产品卖点更有效。', '内容型入口的点击量不最高，但高意向比例优于搜索广告。', '马来语场景的内容和跟进仍不足，影响回复率和销售接手率。'],
  improvements: [{ id: 'improve-qualified', title: '提高销售合格线索占比', detail: '把高意向问题整理成销售跟进脚本，并在首轮触达中增加资格判断问题。', expectedMetric: 'qualifiedLeads', expectedDelta: 4, convertedTaskIds: [] }, { id: 'improve-reply', title: '提高本地化触达回复率', detail: '新增 4 条马来语场景内容，针对不同岗位改写首封触达文案。', expectedMetric: 'replyRate', expectedDelta: 3, convertedTaskIds: [] }],
  nextAction: '下一轮先补齐马来语内容和销售资格判断，再复用同一套指标比较结果。', confidence: 0.88, evidence: ['LinkedIn 定向线索质量评分 86', '有效线索 72 条，高于目标 60 条', '销售合格线索 19 条，回复率 15%'],
}

export const overseasMockApi = {
  async getCase() { return wait(marketingCase, 120) },
  async setCaseLead(caseId: number, leadId: number) { if (marketingCase.id === caseId) { const lead = leads.find((item) => item.id === leadId); if (lead) { marketingCase.leadId = leadId; marketingCase.name = `${lead.companyName} · ${lead.targetMarkets[0]} GTM 验证`; marketingCase.market = lead.targetMarkets.slice(0, 2).join('、'); marketingCase.targetMarkets = lead.targetMarkets; marketingCase.description = lead.growthSignal; marketingCase.stage = '潜客分析' } } return wait(marketingCase, 180) },
  async getLeads(query: import('../types/overseas').LeadQuery) { const filtered = leads.filter((item) => (!query.companyName || item.companyName.toLowerCase().includes(query.companyName.toLowerCase())) && (!query.country || item.country === query.country) && (!query.aiCategory || item.aiCategory === query.aiCategory) && (!query.source || item.source === query.source) && (!query.priority || item.priority === query.priority) && (!query.followUpStatus || item.followUpStatus === query.followUpStatus)).sort((a, b) => b.fitScore - a.fitScore); const start = (query.pageNo - 1) * query.pageSize; return wait({ list: filtered.slice(start, start + query.pageSize), total: filtered.length }, 240) },
  async discoverLeads(source: import('../types/overseas').LeadSource) { const available = discoveryPool.filter((item) => !leads.some((lead) => lead.id === item.id)).slice(0, 2).map((item) => ({ ...item, source, sourceDetail: `${source} · 模拟同步`, capturedAt: '2026-10-17' })); leads.push(...available); return wait(available, 620) },
  async analyzeLead(leadId: number) { return wait(analyses[leadId], 720) },
  async generateOutreach(leadId: number, channel?: import('../types/overseas').OutreachChannel) { const base = outreachDrafts[leadId] || outreachDrafts[1]; if (!channel || channel === base.channel) return wait(base, 520); return wait({ ...base, channel, subject: undefined, content: `${base.content.split('\n\n')[0]}\n\nWould it be useful to exchange a short overview of your current overseas growth workflow?` }, 520) },
  async getProposals() { return wait(Object.values(proposals), 220) },
  async generateProposal(leadId: number) { const existing = proposals[leadId]; if (existing) return wait(existing, 640); const lead = leads.find((item) => item.id === leadId) || leads[0]; const generated: Proposal = { id: lead.id, leadId: lead.id, round: marketingCase.round, situation: `${lead.companyName}目前处于${lead.overseasIntent}阶段，${lead.growthSignal}`, goals: ['验证一个目标市场的海外获客闭环', '统一首轮内容和咨询承接口径', '沉淀可复制的线索分层方法'], strategy: [`从${lead.targetMarkets[0]}的高频场景切入，先做小范围试点`, '围绕客户市场制作本地化内容', '每周复盘渠道、咨询和销售接手情况'], deliverables: ['客户问题地图', '本地化内容包', '线索评分表', '试点复盘周报'], timeline: '4 周试点 · 每周一次复盘', targetMetrics: [metricTarget('leads', 0, 30), metricTarget('qualifiedLeads', 0, 10), metricTarget('replyRate', 8, 16), metricTarget('contentCount', 0, 6)], status: '草稿', version: 1, createTime: '2026-10-17 09:20:00', confidence: analyses[lead.id]?.confidence || 0.76, assumptions: ['客户可以提供基础客户画像和历史触达数据'], riskNotes: ['样本量较小时，短周期转化率只能作为方向判断'] }; proposals[lead.id] = generated; return wait(generated, 640) },
  async updateProposalStatus(proposalId: number, status: import('../types/overseas').ProposalStatus) { const proposal = Object.values(proposals).find((item) => item.id === proposalId); if (proposal) proposal.status = status; return wait(proposal, 180) },
  async getTasks() { return wait(tasks, 200) },
  async updateTaskStatus(taskId: number, status: MarketingTask['status']) { const task = tasks.find((item) => item.id === taskId); if (task) task.status = status; return wait(task, 180) },
  async decomposeTasks(proposalId: number) { const proposal = Object.values(proposals).find((item) => item.id === proposalId); const maxId = tasks.reduce((max, item) => Math.max(max, item.id), 0); const generated: MarketingTask[] = [{ id: maxId + 1, proposalId, title: `确认${proposal?.timeline || '试点'}的客户基线`, description: '从方案目标中提取需要客户确认的现状、指标和数据口径。', owner: 'Lena Wang', dueDate: '2026-10-18', status: '待开始', deliverable: '客户基线确认单', source: 'AI 拆解', deliverySampleId: 1, round: marketingCase.round, stage: '执行交付' }, { id: maxId + 2, proposalId, title: '生成首轮本地化内容包', description: '根据方案策略生成内容并准备首轮发布素材。', owner: 'Nadia Chen', dueDate: '2026-10-22', status: '待开始', deliverable: '本地化内容包', source: 'AI 拆解', deliverySampleId: 2, round: marketingCase.round, stage: '执行交付' }, { id: maxId + 3, proposalId, title: '建立线索质量复盘表', description: '将方案预期指标转成每周可记录、可比较的复盘字段。', owner: 'Marcus Lee', dueDate: '2026-10-25', status: '待开始', deliverable: '线索质量复盘表', source: 'AI 拆解', deliverySampleId: 4, round: marketingCase.round, stage: '执行交付' }]; return wait({ proposalId, confidence: 0.87, summary: 'AI 已根据方案目标、交付物和周期拆解出 3 个首轮执行任务。', tasks: generated }, 720) },
  async getDelivery(sampleId: number) { return wait(deliveries[sampleId], 240) },
  async getMetrics() { return wait(metrics, 180) },
  async generateReview() { return wait(review, 480) },
  async generateNextRound(caseId: number) { marketingCase.round += 1; marketingCase.stage = '进入下一轮'; const proposalId = proposals[1].id; const start = tasks.reduce((max, item) => Math.max(max, item.id), 0) + 1; const nextTasks: MarketingTask[] = [{ id: start, proposalId, title: '补齐马来语场景内容与首封文案', description: '针对回复率未达标问题，补充本地化内容和不同岗位版本。', owner: 'Nadia Chen', dueDate: '2026-11-03', status: '待开始', deliverable: '马来语内容包', source: 'AI 复盘', round: marketingCase.round, stage: '进入下一轮' }, { id: start + 1, proposalId, title: '增加销售资格判断问题', description: '在触达和表单中增加预算、时间和使用场景判断。', owner: 'Lena Wang', dueDate: '2026-11-05', status: '待开始', deliverable: '销售跟进脚本', source: 'AI 复盘', round: marketingCase.round, stage: '进入下一轮' }, { id: start + 2, proposalId, title: '建立下一轮渠道对照组', description: '保留 LinkedIn 定向作为主渠道，并为本地化内容设置对照组。', owner: 'Marcus Lee', dueDate: '2026-11-07', status: '待开始', deliverable: '渠道对照表', source: 'AI 复盘', round: marketingCase.round, stage: '进入下一轮' }]; tasks.push(...nextTasks); return wait({ case: marketingCase, tasks: nextTasks }, 760) },
}

const wait = <T,>(value: T, duration = 360) => new Promise<T>((resolve) => window.setTimeout(() => resolve(JSON.parse(JSON.stringify(value)) as T), duration))
