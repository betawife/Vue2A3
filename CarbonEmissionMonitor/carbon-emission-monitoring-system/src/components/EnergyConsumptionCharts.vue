<template>
  <div class="energy-consumption-charts">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">能源消耗分析</h2>
      <p class="page-description">实时监测和分析各类能源消耗情况</p>
    </div>
    
    <!-- 图表容器 -->
    <div class="charts-container">
      <!-- 第一行：左上饼图 + 右上堆叠柱形图 -->
      <div class="chart-row">
        <div class="chart-item chart-pie">
          <div class="chart-content">
            <PieComponent />
          </div>
        </div>
        
        <div class="chart-item chart-stacked-line">
          <div class="chart-content">
            <StackedBarComponent />
          </div>
        </div>
      </div>
      
      <!-- 第二行：左中折线图 + 右中折线图 -->
      <div class="chart-row">
        <div class="chart-item chart-line">
          <div class="chart-content">
            <StackedLineComponent />
          </div>
        </div>
        
        <div class="chart-item chart-line">
          <div class="chart-content">
            <CarbonLineComponent />
          </div>
        </div>
      </div>
      
      <!-- 第三行：底部曲线图 -->
      <div class="chart-row">
        <div class="chart-item chart-curve full-width">
          <div class="chart-content">
            <CarbonAlertComponent />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieComponent from './PieComponent_E.vue';
import StackedBarComponent from './StackedBarComponent_E.vue';
import StackedLineComponent from './LineComponent_E.vue';
import CarbonLineComponent from './LineComponent_EC.vue';
import CarbonAlertComponent from './CarbonAlertComponent.vue';

export default {
  name: 'EnergyConsumptionCharts',
  components: {
    PieComponent,
    StackedBarComponent,
    StackedLineComponent,
    CarbonLineComponent,
    CarbonAlertComponent
  },
}
</script>

<style scoped>
.energy-consumption-charts {
  padding: 20px;
  height: 100%;
  background: #f8f9fa;
}

.page-header {
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2d3d;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #5e6d82;
  margin: 0;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chart-item.full-width {
  grid-column: 1 / -1;
}

.chart-content {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
  padding: 20px;
}

.chart-item.full-width .chart-content {
  min-height: 350px;
}

.chart-content p {
  font-size: 16px;
  color: #909399;
  margin: 0;
  text-align: center;
}

/* 图表组件样式调整 */
.chart-content > :deep(.pie-component) {
  width: 100%;
  height: 100%;
}

.chart-content > :deep(.pie-component .pie-component) {
  height: 100%;
}

.chart-content > :deep(.pie-component .chart-container) {
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .chart-item.full-width {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .energy-consumption-charts {
    padding: 12px;
  }
  
  .chart-content {
    min-height: 250px;
  }
  
  .chart-item.full-width .chart-content {
    min-height: 300px;
  }
}
</style>