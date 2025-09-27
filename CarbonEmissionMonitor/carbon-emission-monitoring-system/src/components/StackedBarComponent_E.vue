<template>
  <div class="stacked-bar-component">
    <div class="component-header">
      <h3>能源消耗组成</h3>
      <p>长三角地区月度能耗结构分析</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import { inject, onMounted, reactive, ref, nextTick, onUnmounted, watch } from 'vue';

export default {
  name: 'StackedBarComponent',
  setup() {
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);

    // 响应式数据
    const barData = reactive({
      jiangsu: [],
      zhejiang: [],
      shanghai: []
    });
    const currentMonth = ref('01');
    const currentMonthData = reactive({
      jiangsu: {},
      zhejiang: {},
      shanghai: {}
    });

    // 主题注入
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme');
    const lowCarbonTheme = inject('lowCarbonTheme');

    // 能源类型配置（颜色、名称）
    const energyTypes = [
      { key: 'coal', name: '煤炭', color: '#FF6B6B' },
      { key: 'electricity', name: '电力', color: '#4ECDC4' },
      { key: 'gas', name: '天然气', color: '#45B7D1' },
      { key: 'oil', name: '石油', color: '#FFA07A' },
      { key: 'newEnergy', name: '新能源', color: '#98D8C8' }
    ];

    // 监听月份切换
    eventBus.on('monthChanged_E', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value);
      initChart();
    });

    // 获取数据
    async function getBarData() {
      try {
        const response = await $axios.get('/stackedbar_E/data'); 
        Object.assign(barData, response.data.StackedBarData);
        disposeData(currentMonth.value);
        return true;
      } catch (error) {
        console.error('获取堆叠柱状图数据失败:', error);
        return false;
      }
    }

    // 处理当前月份数据
    function disposeData(month) {
      const index = barData.months?.indexOf(month) ?? -1;
      if (index === -1) return;

      currentMonthData.jiangsu = barData.jiangsu?.[index] || {};
      currentMonthData.zhejiang = barData.zhejiang?.[index] || {};
      currentMonthData.shanghai = barData.shanghai?.[index] || {};
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value || !barData.months) return;

      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);

      const regions = ['江苏', '浙江', '上海'];
      const seriesData = energyTypes.map(energy => ({
        name: energy.name,
        type: 'bar',
        stack: '能源',
        data: regions.map(region => {
          const regionKey = region === '江苏' ? 'jiangsu' : region === '浙江' ? 'zhejiang' : 'shanghai';
          return currentMonthData[regionKey]?.[energy.key] || 0;
        }),
        itemStyle: {
          color: energy.color
        },
        emphasis: {
          focus: 'series'
        }
      }));

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let total = 0;
            params.forEach(item => {
              total += item.value;
            });
            let result = `${params[0].name}<br/>`;
            params.forEach(item => {
              const percent = ((item.value / total) * 100).toFixed(1);
              result += `${item.marker} ${item.seriesName}: ${item.value} 万吨 (${percent}%)<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: energyTypes.map(e => e.name),
          top: 35,
          left: 'center', // 图例居中
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%', 
          top: '80px', 
          containLabel: true
        },
        
        xAxis: {
          type: 'value',
          name: '万吨',
          nameTextStyle: {
            fontSize: 12
          },
          axisLabel: {
            fontSize: 11
          },
          nameLocation: 'end'
        },
        yAxis: {
          type: 'category',
          data: regions,
          axisLabel: {
            fontSize: 12
          }
        },
        series: seriesData,
        title: {
          text: `2024-${currentMonth.value}月 三地区能耗结构`,
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        }
      };

      myChart.setOption(option);
      chartLoaded.value = true;

      // 窗口调整
      const resizeHandler = () => myChart.resize();
      window.addEventListener('resize', resizeHandler);

      // 主题切换监听
      watch(theme, () => {
        myChart.dispose();
        chartLoaded.value = false;
        nextTick(() => initChart());
      });

      // 清理函数
      return () => {
        window.removeEventListener('resize', resizeHandler);
        myChart.dispose();
      };
    }

    onMounted(async () => {
      const success = await getBarData();
      if (success) {
        nextTick(initChart);
      }
    });

    onUnmounted(() => {
      eventBus.off('monthChanged');
    });

    return {
      chartContainer,
      chartLoaded
    };
  }
};
</script>

<style scoped>
.stacked-bar-component {
  height: 100%;
  width:100%;
  display: flex;
  flex-direction: column;
}

.component-header {
  margin-bottom: 15px;
  text-align: left;
}

.component-header h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1f2d3d;
  text-align: left;
}

.component-header p {
  margin: 0;
  font-size: 12px;
  color: #7a8a9a;
  text-align: left;
}

.chart-container {
  flex: 1;
  min-height: 300px;  
  width: 100%;
}
</style>