<template>
  <div class="line-component">
    <div class="component-header">
      <h3>碳排放趋势图</h3>
      <p>历史碳排变化趋势</p>
    </div>
    <div class="chart-placeholder">
      <i class="icon-trend"></i>
      <span>趋势图加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineComponent',
  setup() {
    return {};
  }
}
</script>

<style scoped>
.line-component {
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

.icon-trend:before {
  content: "📉";
  font-size: 40px;
  margin-bottom: 10px;
}
</style>