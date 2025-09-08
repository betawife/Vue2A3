<template>
  <div class="radar-component">
    <div class="component-header">
      <h3>碳排放分析雷达图</h3>
      <p>多维度碳排分析</p>
    </div>
    <div class="chart-placeholder">
      <i class="icon-radar"></i>
      <span>雷达图加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadarComponent',
  setup() {
    return {};
  }
}
</script>

<style scoped>
.radar-component {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  margin-bottom: 15px;
}

.component-header h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #1f2d3d;
}

.component-header p {
  margin: 0;
  font-size: 12px;
  color: #7a8a9a;
}

.chart-placeholder {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.icon-radar:before {
  content: "📈";
  font-size: 40px;
  margin-bottom: 10px;
}
</style>