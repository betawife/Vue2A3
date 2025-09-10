<template>
  <div class="carbon-emission-charts">
    <div class="charts-grid">
      <!-- 左上: 雷达图 -->
      <div class="chart-cell top-left">
        <RadarComponent />
      </div>
      
      <!-- 中上: 碳排放地图 -->
      <div class="chart-cell top-center">
        <CarbonMap />
      </div>
      
      <!-- 右上: 旭日图 -->
      <div class="chart-cell top-right">
        <SunBurst />
      </div>
      
      <!-- 底部: 堆叠折线图 -->
      <div class="chart-cell bottom">
        <LineComponent />
      </div>
    </div>
  </div>
</template>

<script>
import RadarComponent from './RadarComponent.vue'
import CarbonMap from './CarbonMap.vue'
import SunBurst from './SunBurst.vue'
import LineComponent from './LineComponent.vue'

export default {
  name: 'CarbonEmissionCharts',
  components: {
    RadarComponent,
    CarbonMap,
    SunBurst,
    LineComponent
  },
  setup() {
    return {};
  }
}
</script>

<style scoped>
.carbon-emission-charts {
  height: 100%;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr; /* 调整中间列宽度 */
  grid-template-rows: 500px 400px; /* 明确指定行高 */
  gap: 20px;
  height: 100%;
}

.chart-cell {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.chart-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.15);
}

.top-left {
  grid-column: 1;
  grid-row: 1;
}

.top-center {
  grid-column: 2;
  grid-row: 1;
  height: 500px; /* 固定地图高度 */
}

.top-right {
  grid-column: 3;
  grid-row: 1;
}

.bottom {
  grid-column: 1 / span 3;
  grid-row: 2;
  height: 400px; /* 固定折线图高度 */
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 400px 400px 400px;
  }
  
  .top-center {
    grid-column: 1 / span 2;
    grid-row: 1;
    height: 400px;
  }
  
  .top-left {
    grid-column: 1;
    grid-row: 2;
  }
  
  .top-right {
    grid-column: 2;
    grid-row: 2;
  }
  
  .bottom {
    grid-column: 1 / span 2;
    grid-row: 3;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .carbon-emission-charts {
    padding: 12px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 15px;
  }
  
  .top-center,
  .top-left,
  .top-right,
  .bottom {
    grid-column: 1;
    height: auto;
    min-height: 350px;
  }
  
  .top-center {
    grid-row: 1;
  }
  
  .top-left {
    grid-row: 2;
  }
  
  .top-right {
    grid-row: 3;
  }
  
  .bottom {
    grid-row: 4;
    margin-top: 0;
  }
  
  .chart-cell {
    padding: 12px;
  }
}
</style>