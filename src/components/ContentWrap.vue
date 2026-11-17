<template>
  <el-card class="content-wrap" shadow="never">
    <template v-if="title" #header>
      <div class="flex items-center justify-between gap-3">
        <span class="section-title">{{ title }}</span>
        <div><slot name="header" /></div>
      </div>
    </template>
    <slot />
  </el-card>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>
