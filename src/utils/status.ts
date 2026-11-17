import type { LeadFollowUpStatus, LeadPriority, ProposalStatus, TaskStatus } from '../types/overseas'

export function priorityTagType(priority: LeadPriority) {
  return priority === '高' ? 'danger' : priority === '中' ? 'warning' : 'info'
}

export function followUpTagType(status: LeadFollowUpStatus) {
  return status === '已转化' ? 'info' : status === '跟进中' ? 'warning' : status === '已联系' ? 'info' : 'info'
}

export function taskTagType(status: TaskStatus) {
  return status === '已完成' ? 'info' : status === '进行中' ? 'warning' : status === '已逾期' ? 'danger' : 'info'
}

export function proposalTagType(status: ProposalStatus) {
  return status === '已完成' ? 'info' : status === '执行中' ? 'warning' : status === '待确认' ? 'info' : 'info'
}
