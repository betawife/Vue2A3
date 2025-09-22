<template>
  <div class="energy-consumption-charts">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">能源消耗分析</h2>
      <p class="page-description">实时监测和分析各类能源消耗情况</p>
    </div>
    
    <!-- 图表容器 -->
    <div class="charts-container">
      <!-- 第一行：左上饼图 + 右上堆叠折线图 -->
      <div class="chart-row">
        <div class="chart-item chart-pie">
          <div class="chart-header">
            <h3>能源结构分布</h3>
            <div class="chart-actions">
              <button class="action-btn">导出</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">📊</div>
              <p>饼图区域</p>
              <span>展示各类能源占比</span>
            </div>
          </div>
        </div>
        
        <div class="chart-item chart-stacked-line">
          <div class="chart-header">
            <h3>能源消耗趋势</h3>
            <div class="chart-actions">
              <select class="time-select">
                <option>近7天</option>
                <option>近30天</option>
                <option>近一年</option>
              </select>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">📈</div>
              <p>堆叠折线图区域</p>
              <span>展示多能源消耗趋势</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 第二行：左中折线图 + 右中折线图 -->
      <div class="chart-row">
        <div class="chart-item chart-line">
          <div class="chart-header">
            <h3>碳排放趋势</h3>
            <div class="chart-actions">
              <button class="action-btn">详情</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">🌿</div>
              <p>折线图区域</p>
              <span>展示碳排放变化趋势</span>
            </div>
          </div>
        </div>
        
        <div class="chart-item chart-line">
          <div class="chart-header">
            <h3>能效分析</h3>
            <div class="chart-actions">
              <button class="action-btn">对比</button>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">⚡</div>
              <p>折线图区域</p>
              <span>展示能源利用效率</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 第三行：底部曲线图 -->
      <div class="chart-row">
        <div class="chart-item chart-curve full-width">
          <div class="chart-header">
            <h3>综合能源消耗曲线</h3>
            <div class="chart-actions">
              <div class="legend">
                <span class="legend-item">
                  <span class="legend-color electric"></span>
                  电力
                </span>
                <span class="legend-item">
                  <span class="legend-color gas"></span>
                  天然气
                </span>
                <span class="legend-item">
                  <span class="legend-color water"></span>
                  水资源
                </span>
              </div>
            </div>
          </div>
          <div class="chart-placeholder">
            <div class="placeholder-content">
              <div class="placeholder-icon">🌐</div>
              <p>曲线图区域</p>
              <span>展示综合能源消耗情况</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnergyConsumptionCharts',
  data() {
    return {
      // 这里可以添加组件数据
    }
  },
  methods: {
    // 这里可以添加组件方法
  }
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
}

.chart-item.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafbfc;
}

.chart-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
  margin: 0;
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #5e6d82;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.time-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #5e6d82;
  font-size: 12px;
  cursor: pointer;
}

.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #5e6d82;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.electric {
  background: #409eff;
}

.legend-color.gas {
  background: #f56c6c;
}

.legend-color.water {
  background: #67c23a;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
}

.chart-item.full-width .chart-placeholder {
  height: 350px;
}

.placeholder-content {
  text-align: center;
  color: #909399;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.placeholder-content p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.placeholder-content span {
  font-size: 14px;
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
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .chart-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .legend {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>