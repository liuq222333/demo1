<template>
  <div class="metric-card">
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">{{ value }}</div>
    <div class="metric-detail">{{ detail }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; detail: string }>()
</script>
