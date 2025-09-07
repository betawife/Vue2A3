<template>
  <div class="placeholder-component">
    <h2>碳排放地图</h2>
    <p>地图组件将在这里显示</p>
    <div class="map-placeholder">
      <i class="icon-map"></i>
      <span>地图加载中...</span>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'CarbonMap',
  setup() {
    onMounted(() => {
      // 地图初始化逻辑
    });
    
    return {};
  }
};
</script>

<style scoped>
.placeholder-component {
  padding: 24px;
}

.placeholder-component h2 {
  color: #1f2d3d;
  margin-bottom: 16px;
}

.placeholder-component p {
  color: #666;
  margin-bottom: 24px;
}

.map-placeholder {
  height: 400px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.map-placeholder .icon-map {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>