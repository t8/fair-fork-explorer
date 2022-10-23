<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ id: string }>()

</script>

<template>
  <li>{{ id }}</li>
</template>

<style scoped>

</style>
