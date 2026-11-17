<template>
  <div v-if="delivery" class="delivery-preview">
    <div class="delivery-head"><div><div class="muted">{{ delivery.type }} · {{ delivery.createdAt }}</div><h3>{{ delivery.title }}</h3><p>{{ delivery.summary }}</p></div><el-tag size="small" type="info">{{ delivery.owner }}</el-tag></div>
    <div v-for="(block, index) in delivery.blocks" :key="index" class="delivery-block">
      <p v-if="block.kind === 'paragraph'" class="delivery-paragraph">{{ block.text }}</p>
      <ul v-else-if="block.kind === 'list'" class="delivery-list"><li v-for="item in block.items" :key="item">{{ item }}</li></ul>
      <div v-else-if="block.kind === 'email'" class="delivery-email"><div class="delivery-email-label">{{ block.variant }}</div><div class="delivery-email-subject">{{ block.subject }}</div><p>{{ block.body }}</p></div>
      <el-descriptions v-else-if="block.kind === 'kv'" :column="1" border size="small"><el-descriptions-item v-for="item in block.items" :key="item.label" :label="item.label">{{ item.value }}</el-descriptions-item></el-descriptions>
      <div v-else-if="block.kind === 'metric'" class="delivery-metrics"><div v-for="item in block.items" :key="item.label" class="delivery-metric"><span>{{ item.label }}</span><strong>{{ item.value }}</strong><small>{{ item.hint }}</small></div></div>
      <el-table v-else-if="block.kind === 'table'" :data="block.rows.map((row) => Object.fromEntries(row.map((cell, i) => [`col${i}`, cell])))" size="small" border><el-table-column v-for="(header, i) in block.headers" :key="header" :prop="`col${i}`" :label="header" min-width="110" /></el-table>
    </div>
    <div class="delivery-footer"><el-button size="small" type="primary" @click="copyDelivery">{{ copied ? '已复制' : '复制交付内容' }}</el-button></div>
  </div>
  <el-empty v-else description="暂无交付样例" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { DeliverySample } from '../types/overseas'

const props = defineProps<{ delivery?: DeliverySample }>()
const copied = ref(false)
async function copyDelivery() { if (!props.delivery) return; await navigator.clipboard?.writeText(props.delivery.rawMarkdown); copied.value = true; ElMessage.info('交付样例已复制'); window.setTimeout(() => copied.value = false, 1600) }
</script>
