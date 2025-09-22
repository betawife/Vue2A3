<template>
  <div class="energy-carbon-charts">
    <!-- 嵌套路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'EnergyAndCarbonCharts'
}
</script>

<style scoped>
.energy-carbon-charts {
  padding: 20px;
  height: 100%;
}
</style>