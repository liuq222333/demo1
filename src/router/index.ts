import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/overview' },
    { path: '/overview', component: () => import('../views/overview/index.vue'), meta: { title: '营销总览', stage: '潜客分析' } },
    { path: '/leads', component: () => import('../views/leads/index.vue'), meta: { title: '潜客分析', stage: '潜客分析' } },
    { path: '/follow-up', component: () => import('../views/follow-up/index.vue'), meta: { title: '客户跟进', stage: '首次触达' } },
    { path: '/proposals', component: () => import('../views/proposals/index.vue'), meta: { title: '服务方案', stage: '方案确认' } },
    { path: '/tasks', component: () => import('../views/tasks/index.vue'), meta: { title: '执行交付', stage: '执行交付' } },
    { path: '/review', component: () => import('../views/review/index.vue'), meta: { title: '数据复盘', stage: '数据复盘' } },
  ],
})

export default router
