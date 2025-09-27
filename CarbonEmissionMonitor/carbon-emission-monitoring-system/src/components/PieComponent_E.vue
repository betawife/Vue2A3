<template>
  <div class="pie-component">
    <div class="component-header">
      <h3>能源消耗占比</h3>
      <p>长三角地区月度能耗占比分析</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted, watch} from 'vue';

export default {
  name:'PieComponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    // 定义响应式数据
    let pieData = reactive({});
    let currentMonth = ref('01');
    let currentMonthData = ref([]);
    
    // 注入主题对象
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme'); 
    const lowCarbonTheme = inject('lowCarbonTheme'); 

    // 监听月份变化的事件总线
    eventBus.on('monthChanged_E', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value);
      initChart();
    });

    // 获取后端数据(所有月份)
    async function getPieData(){
      try {
        const response = await $axios.get('/pie_E/data');
        Object.assign(pieData, response.data.PieData);
        disposeData(currentMonth.value);
        return true;
      } catch (error) {
        console.error('Energy获取饼图数据失败:', error);
        currentMonthData.value = [];
        return false; 
      }
    }
    
    // 处理数据(当前月份)
    function disposeData(currentMonth){
      const monthKey = '2024-' + currentMonth;
      currentMonthData.value = pieData[monthKey] || [];
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value || !currentMonthData.value.length) return;
      
      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);
      
      const monthName = '2024-' + currentMonth.value;
      const total = currentMonthData.value.reduce((sum, item) => sum + item.value, 0);
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const percent = ((params.value / total) * 100).toFixed(2);
            return `${params.name}<br/>能源消耗: ${params.value} 万吨<br/>占比: ${percent}%`;
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: currentMonthData.value.map(item => item.name),
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '能源消耗',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,

            label: {
              show: true,
              formatter: '{b}: {d}%',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true
            },
            data: currentMonthData.value
          }
        ],
        title: {
          text: `${monthName}月 三地区能耗占比`,
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        grid: {
          top: '60px',
          left: '10px',
          right: '10px',
          bottom: '10px'
        }
      };
      
      myChart.setOption(option);
      chartLoaded.value = true;
      
      // 监听窗口调整大小
      const resizeHandler = function() {
        myChart.resize();
      };
      window.addEventListener('resize', resizeHandler);
      
      // 监听主题变化
      watch(theme, () => {
        if (myChart) {
          myChart.dispose();
          chartLoaded.value = false;
          initChart();
        }
      });
      
      // 返回清理函数
      return () => {
        window.removeEventListener('resize', resizeHandler);
        myChart.dispose();
      };
    }

    onMounted(async () => {
      const success = await getPieData();
      if (success) {
        nextTick(() => {
          initChart();
        });
      }
    });

    onUnmounted(() => {
      eventBus.off('monthChanged');
    });
    
    return {
      chartContainer,
      chartLoaded
    }
  },
}
</script>

<style scoped>
.pie-component {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
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

.chart-container {
  flex: 1;
  min-height: 400px;
  width: 100%;
}
</style>