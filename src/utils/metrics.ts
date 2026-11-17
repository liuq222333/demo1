import type { MetricDirection, MetricKey, MetricTarget } from '../types/overseas'

export const metricCatalog: Record<MetricKey, { label: string; unit: string; direction: MetricDirection }> = {
  impressions: { label: '曝光量', unit: '次', direction: 'up' },
  clicks: { label: '点击量', unit: '次', direction: 'up' },
  leads: { label: '有效线索', unit: '条', direction: 'up' },
  qualifiedLeads: { label: '销售合格线索', unit: '条', direction: 'up' },
  replyRate: { label: '触达回复率', unit: '%', direction: 'up' },
  contentCount: { label: '内容产出', unit: '篇', direction: 'up' },
  cpl: { label: '单条线索成本', unit: '元', direction: 'down' },
}

export function metricTarget(key: MetricKey, baseline: number, target: number): MetricTarget {
  return { key, baseline, target, ...metricCatalog[key] }
}

export function formatMetric(value: number, unit: string) {
  return `${value.toLocaleString('zh-CN')}${unit === '%' ? '%' : ` ${unit}`}`
}

export function isMetricAchieved(target: MetricTarget, actual: number) {
  return target.direction === 'up' ? actual >= target.target : actual <= target.target
}
