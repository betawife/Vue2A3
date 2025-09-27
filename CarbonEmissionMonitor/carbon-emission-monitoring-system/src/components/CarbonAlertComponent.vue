<!-- CarbonAlertComponent.vue -->
<template>
  <div class="carbon-alert-component">
    <div class="component-header">
      <h3>碳排预警监控</h3>
      <p>2024年长三角地区碳排放预警</p>
    </div>
    
    <!-- 预警指标卡片 -->
    <div class="alert-cards">
      <div class="alert-card" :class="getAlertLevel('jiangsu').level" @click="focusRegion('jiangsu')">
        <div class="card-header">
          <span class="region-name">江苏省</span>
          <span class="alert-badge" :class="getAlertLevel('jiangsu').level">
            {{ getAlertLevel('jiangsu').text }}
          </span>
        </div>
        <div class="card-content">
          <div class="carbon-value">{{ getCurrentCarbon('jiangsu') }}</div>
          <div class="carbon-unit">{{ unit }}</div>
        </div>
        <div class="card-footer">
          <span class="trend" :class="getTrendClass('jiangsu')">
            {{ getTrendIcon('jiangsu') }} {{ getTrendText('jiangsu') }}
          </span>
          <span class="threshold-info">
            预警:{{ alertThresholds.jiangsu.warning }} 危险:{{ alertThresholds.jiangsu.danger }}
          </span>
        </div>
      </div>
      
      <div class="alert-card" :class="getAlertLevel('zhejiang').level" @click="focusRegion('zhejiang')">
        <div class="card-header">
          <span class="region-name">浙江省</span>
          <span class="alert-badge" :class="getAlertLevel('zhejiang').level">
            {{ getAlertLevel('zhejiang').text }}
          </span>
        </div>
        <div class="card-content">
          <div class="carbon-value">{{ getCurrentCarbon('zhejiang') }}</div>
          <div class="carbon-unit">{{ unit }}</div>
        </div>
        <div class="card-footer">
          <span class="trend" :class="getTrendClass('zhejiang')">
            {{ getTrendIcon('zhejiang') }} {{ getTrendText('zhejiang') }}
          </span>
          <span class="threshold-info">
            预警:{{ alertThresholds.zhejiang.warning }} 危险:{{ alertThresholds.zhejiang.danger }}
          </span>
        </div>
      </div>
      
      <div class="alert-card" :class="getAlertLevel('shanghai').level" @click="focusRegion('shanghai')">
        <div class="card-header">
          <span class="region-name">上海市</span>
          <span class="alert-badge" :class="getAlertLevel('shanghai').level">
            {{ getAlertLevel('shanghai').text }}
          </span>
        </div>
        <div class="card-content">
          <div class="carbon-value">{{ getCurrentCarbon('shanghai') }}</div>
          <div class="carbon-unit">{{ unit }}</div>
        </div>
        <div class="card-footer">
          <span class="trend" :class="getTrendClass('shanghai')">
            {{ getTrendIcon('shanghai') }} {{ getTrendText('shanghai') }}
          </span>
          <span class="threshold-info">
            预警:{{ alertThresholds.shanghai.warning }} 危险:{{ alertThresholds.shanghai.danger }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 三区域预警趋势图表 -->
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted, watch} from 'vue';

export default {
  name:'CarbonAlertComponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    // 定义响应式数据
    let carbonData = reactive({});
    let currentMonth = ref('01');
    let focusedRegion = ref(null);
    let myChart = ref(null); // 保存图表实例
    
    // 各省独立预警阈值配置
    const alertThresholds = {
      jiangsu: { warning: 5200, danger: 5600 },
      zhejiang: { warning: 3000, danger: 3200 },
      shanghai: { warning: 1600, danger: 1700 }
    };
    
    // 注入主题对象
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme');
    const lowCarbonTheme = inject('lowCarbonTheme');
    
    // 获取后端数据
    async function getCarbonData(){
      try {
        const response = await $axios.get('/line_EC/data');
        if (response.data.LineData.carbonEmissions) {
          Object.assign(carbonData, response.data.LineData.carbonEmissions);
          return true;
        }
      } catch (error) {
        console.error('预警获取碳排放数据失败:', error);
        return false;
      }
    }
    
    // 聚焦区域
    function focusRegion(region) {
      focusedRegion.value = focusedRegion.value === region ? null : region;
      updateChartFocus();
    }
    
    // 更新图表聚焦状态
    function updateChartFocus() {
      if (!myChart.value) return;
      
      const option = myChart.value.getOption();
      const isFocused = focusedRegion.value !== null;
      
      // 重置所有系列样式
      option.series.forEach((series, index) => {
        // 恢复默认样式
        if (series.type === 'line' && series.data && series.data.length > 0) {
          // 数据线系列
          series.lineStyle = series.lineStyle || {};
          series.lineStyle.width = 3;
          series.lineStyle.opacity = 1;
          series.itemStyle = series.itemStyle || {};
          series.itemStyle.opacity = 1;
          series.symbolSize = 6;
        } else {
          // 色块区域系列
          series.itemStyle = series.itemStyle || {};
          series.itemStyle.opacity = 0.3;
        }
      });
      
      // 如果聚焦某个区域，突出显示
      if (isFocused) {
        const regionIndexMap = { jiangsu: 0, zhejiang: 1, shanghai: 2 };
        const focusedIndex = regionIndexMap[focusedRegion.value];
        
        option.series.forEach((series, index) => {
          const seriesRegionIndex = Math.floor(index / 4); // 每4个系列为一个区域
          
          if (seriesRegionIndex === focusedIndex) {
            // 聚焦区域的数据线加粗
            if (series.type === 'line' && series.data && series.data.length > 0) {
              series.lineStyle.width = 4;
              series.itemStyle.borderWidth = 2;
              series.symbolSize = 8;
            } else {
              // 聚焦区域的色块保持正常透明度
              series.itemStyle.opacity = 0.3;
            }
          } else {
            // 非聚焦区域淡化处理
            if (series.type === 'line' && series.data && series.data.length > 0) {
              series.lineStyle.opacity = 0.3;
              series.itemStyle.opacity = 0.3;
            } else {
              // 非聚焦区域的色块淡化
              series.itemStyle.opacity = 0.1;
            }
          }
        });
        
        // 更新标题
        option.title[0].text = `2024年 ${getRegionName(focusedRegion.value)}碳排放预警趋势`;
      } else {
        // 取消聚焦，恢复原标题
        option.title[0].text = '2024年 长三角地区碳排放预警趋势';
      }
      
      myChart.value.setOption(option);
    }
    
    // 获取当前月份碳排放值
    function getCurrentCarbon(region) {
      if (!carbonData[region] || !carbonData.months) return 0;
      const monthIndex = carbonData.months.indexOf(currentMonth.value);
      return monthIndex >= 0 ? carbonData[region][monthIndex] : 0;
    }
    
    // 获取预警等级
    function getAlertLevel(region) {
      const currentValue = getCurrentCarbon(region);
      const thresholds = alertThresholds[region];
      
      if (currentValue >= thresholds.danger) {
        return { level: 'danger', text: '严重预警' };
      } else if (currentValue >= thresholds.warning) {
        return { level: 'warning', text: '一般预警' };
      } else {
        return { level: 'safe', text: '正常' };
      }
    }
    
    // 获取趋势信息
    function getTrendInfo(region) {
      if (!carbonData[region] || carbonData[region].length < 2) return { trend: 0 };
      
      const monthIndex = carbonData.months.indexOf(currentMonth.value);
      if (monthIndex <= 0) return { trend: 0 };
      
      const current = carbonData[region][monthIndex];
      const previous = carbonData[region][monthIndex - 1];
      const trend = ((current - previous) / previous * 100).toFixed(1);
      
      return { trend };
    }
    
    function getTrendClass(region) {
      const trend = getTrendInfo(region).trend;
      return trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
    }
    
    function getTrendIcon(region) {
      const trend = getTrendInfo(region).trend;
      return trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
    }
    
    function getTrendText(region) {
      const trend = getTrendInfo(region).trend;
      return trend !== 0 ? `${Math.abs(trend)}%` : '平稳';
    }
    
    // 初始化图表
    function initChart() {
      if (!chartContainer.value) return;

      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      myChart.value = $echarts.init(chartContainer.value, currentThemeConfig);
      
      // 准备数据
      const months = carbonData.months || [];
      const jiangsuData = carbonData.jiangsu || [];
      const shanghaiData = carbonData.shanghai || [];
      const zhejiangData = carbonData.zhejiang || [];
      
      // 计算每个区域的最大值
      const jiangsuMax = Math.max(...jiangsuData) * 1.1;
      const zhejiangMax = Math.max(...zhejiangData) * 1.1;
      const shanghaiMax = Math.max(...shanghaiData) * 1.1;
      
      let option = {
        title: [{
          text: '2024年 长三角地区碳排放预警趋势',
          left: 'center'
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['江苏省', '浙江省', '上海市', '安全区域', '预警区域', '危险区域'],
          top: 40,
        },
        //三图表的绘图区域
        grid: [
          {
            left: '3%',
            right: '55%',
            bottom: '45%',
            top: 100,
            containLabel: true
          },
          {
            left: '7%',
            right: '55%',
            bottom: '5%',
            top: '60%',
            containLabel: true
          },
          {
            left: '45%',
            right: '5%',
            bottom: '5%',
            top: 100,
            containLabel: true
          }
        ],
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: months,
            axisLabel: { interval: 0, rotate: 45 }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: months,
            axisLabel: { interval: 0, rotate: 45 }
          },
          {
            type: 'category',
            gridIndex: 2,
            data: months,
            axisLabel: { interval: 0, rotate: 45 }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            name: '江苏碳排放(吨)',
            max: jiangsuMax,
            nameTextStyle: { fontWeight: 'bold' }
          },
          {
            type: 'value',
            gridIndex: 1,
            name: '浙江碳排放(吨)',
            max: zhejiangMax,
            nameTextStyle: { fontWeight: 'bold' }
          },
          {
            type: 'value',
            gridIndex: 2,
            name: '上海碳排放(吨)',
            max: shanghaiMax,
            nameTextStyle: { fontWeight: 'bold' }
          }
        ],
        series: [
          ...createRegionSeries('jiangsu', 0, jiangsuData, jiangsuMax),
          ...createRegionSeries('zhejiang', 1, zhejiangData, zhejiangMax),
          ...createRegionSeries('shanghai', 2, shanghaiData, shanghaiMax)
        ]
      };
      
      myChart.value.setOption(option);
      chartLoaded.value = true;
      
      // 图表点击事件,触发月份变化
      myChart.value.on('click', (params) => {
        if (params.componentType === 'xAxis' || 
            (params.componentType === 'series' && params.value !== undefined)) {
          
          let targetMonth;
          if (params.componentType === 'xAxis') {
            targetMonth = params.value;
          } else {
            const gridIndex = params.seriesIndex !== undefined ? Math.floor(params.seriesIndex / 4) : 0;
            targetMonth = months[params.dataIndex];
          }
          
          if (targetMonth && typeof targetMonth === 'string') {
            currentMonth.value = targetMonth;
            eventBus.emit('monthChanged_Alert', currentMonth.value);
          }
        }
      });

      // 监听主题变化
      watch(theme, () => {
        if (myChart.value) {
          myChart.value.dispose();
          chartLoaded.value = false;
          initChart();
        }
      });
      
      // 监听月份变化
      eventBus.on('monthChanged_Alert', (month) => {
        currentMonth.value = month;
      });
      
      // 监听窗口调整大小
      const resizeHandler = function() {
        if (myChart.value) {
          myChart.value.resize();
        }
      };
      window.addEventListener('resize', resizeHandler);
      
      // 返回清理函数
      return () => {
        window.removeEventListener('resize', resizeHandler);
        eventBus.off('monthChanged_Alert');
      };
    }
    
    // 创建区域系列数据
    function createRegionSeries(region, gridIndex, data, yMax) {
      const thresholds = alertThresholds[region];
      const regionColors = {
        jiangsu: { line: '#1976d2', safe: 'rgba(76, 175, 80, 0.3)', warning: 'rgba(255, 167, 38, 0.3)', danger: 'rgba(239, 83, 80, 0.3)' },
        zhejiang: { line: '#7b1fa2', safe: 'rgba(76, 175, 80, 0.3)', warning: 'rgba(255, 167, 38, 0.3)', danger: 'rgba(239, 83, 80, 0.3)' },
        shanghai: { line: '#d32f2f', safe: 'rgba(76, 175, 80, 0.3)', warning: 'rgba(255, 167, 38, 0.3)', danger: 'rgba(239, 83, 80, 0.3)' }
      };
      
      const colors = regionColors[region];
      
      return [
        {
          name: '危险区域',
          type: 'line',
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          markArea: {
            itemStyle: {
              color: colors.danger
            },
            data: [[
              { yAxis: thresholds.danger, name: '危险阈值' },
              { yAxis: yMax }
            ]]
          },
          lineStyle: { opacity: 0 },
          data: []
        },
        {
          name: '预警区域',
          type: 'line',
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          markArea: {
            itemStyle: {
              color: colors.warning
            },
            data: [[
              { yAxis: thresholds.warning, name: '预警阈值' },
              { yAxis: thresholds.danger }
            ]]
          },
          lineStyle: { opacity: 0 },
          data: []
        },
        {
          name: '安全区域',
          type: 'line',
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          markArea: {
            itemStyle: {
              color: colors.safe
            },
            data: [[
              { yAxis: 0, name: '安全区域' },
              { yAxis: thresholds.warning }
            ]]
          },
          lineStyle: { opacity: 0 },
          data: []
        },
        {
          name: getRegionName(region),
          type: 'line',
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          data: data,
          lineStyle: { 
            width: 3,
            color: colors.line
          },
          itemStyle: {
            color: colors.line
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: { 
            focus: 'series'
          }
        }
      ];
    }
    
    function getRegionName(region) {
      const names = {
        jiangsu: '江苏省',
        zhejiang: '浙江省', 
        shanghai: '上海市'
      };
      return names[region];
    }
      
    onMounted(async () => {
      const success = await getCarbonData();
      if (success) {
        await nextTick();
        initChart();
      }
    });
    
    onUnmounted(() => {
      eventBus.off('monthChanged_Alert');
      if (myChart.value) {
        myChart.value.dispose();
      }
    });
    
    return {
      chartContainer,
      chartLoaded,
      alertThresholds,
      unit: '吨 CO2',
      focusRegion,
      getCurrentCarbon,
      getAlertLevel,
      getTrendClass,
      getTrendIcon,
      getTrendText
    }
  },
}
</script>

<style scoped>
.carbon-alert-component {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  margin-bottom: 15px;
}

.component-header h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1f2d3d;
}

.component-header p {
  margin: 0;
  font-size: 12px;
  color: #7a8a9a;
}

.alert-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
}

.alert-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert-card.warning {
  border-left-color: #ffa726;
}

.alert-card.danger {
  border-left-color: #ef5350;
}

.alert-card:active {
  transform: translateY(0);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.region-name {
  font-weight: bold;
  font-size: 14px;
}

.alert-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
}

.alert-badge.safe {
  background: #4caf50;
}

.alert-badge.warning {
  background: #ffa726;
}

.alert-badge.danger {
  background: #ef5350;
}

.card-content {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.carbon-value {
  font-size: 24px;
  font-weight: bold;
  margin-right: 5px;
}

.carbon-unit {
  font-size: 12px;
  color: #7a8a9a;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.trend.up {
  color: #ef5350;
}

.trend.down {
  color: #4caf50;
}

.trend.stable {
  color: #7a8a9a;
}

.threshold-info {
  color: #7a8a9a;
  font-size: 10px;
}

.chart-container {
  flex: 1;
  min-height: 500px;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .alert-cards {
    flex-direction: column;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .chart-container {
    min-height: 800px;
  }
}
</style>