<template>
  <div class="radar-component">
    <div class="component-header">
      <h3>碳排放分析雷达图</h3>
      <p>多维度碳排分析 - 五行业对比</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted, watch} from 'vue';

export default {
  name:'RadarComponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    // 定义响应式数据
    let radarData = reactive({});
    let currentMonthIndex = ref(0);
    let currentMonth = ref('01');
    let currentMonthData = ref([]);
    
    // 注入主题对象
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme'); 
    const lowCarbonTheme = inject('lowCarbonTheme'); 

    // 监听月份变化的事件总线
    eventBus.on('monthChanged', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value);
      initChart();
    });

    // 获取后端数据(所有月份)
    async function getRadarData(){
      try {
        const response = await $axios.get('/radar/data');
        Object.assign(radarData, response.data.RadarData);
        disposeData(currentMonth.value);
        return true;
      } catch (error) {
        console.error('获取雷达图数据失败:', error);
      }
    }
    
    // 处理数据(当前月份)
    function disposeData(currentMonth){
      const monthKey = '2024-' + currentMonth;
      const index = radarData.months ? radarData.months.indexOf(monthKey) : 0;
      currentMonthIndex.value = index >= 0 ? index : 0;  

      if (!radarData.series || !radarData.series.length) {
        currentMonthData.value = [];
        return;
      }
      
      // 将当月数据赋值给响应式变量 currentMonthData
      currentMonthData.value = radarData.series.map(province => {
        return {
          name: province.name,
          value: province.data.map(categoryData => 
            categoryData[currentMonthIndex.value] || 0
          )
        };
      });
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value || !currentMonthData.value.length) return;
      
      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);
      
      const monthName = radarData.months ? radarData.months[currentMonthIndex.value] : '2024-01';
      
      // 计算每个指标的最大值
      const maxValues = radarData.categories.map((_, index) => {
        const values = currentMonthData.value.map(item => item.value[index]);
        return Math.max(...values) * 1.2; // 增加20%的余量
      });
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          position:'right',
          formatter: function(params) {
            return `${params.name} - ${radarData.categories[params.componentIndex]}<br/>碳排放量: ${params.value} 万吨CO₂`;
          },
          show:false
        },
        legend: {
          data: currentMonthData.value.map(item => item.name),
          top:0
        },
        radar: {
          indicator: radarData.categories.map((category, index) => {
            return { 
              name: category, 
              max: Math.max(maxValues[index], 10) // 确保最小值至少为10
            };
          }),
          radius: '65%',
          splitNumber: 4,
          axisName: {
            fontSize: 12
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(0, 0, 0, 0.1)']
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        series: [{
          name: '碳排放分析',
          type: 'radar',
          data: currentMonthData.value,
          emphasis: {
            lineStyle: {
              width: 4
            },
            areaStyle: {
              opacity: 0.5
            }
          },
          areaStyle: {
            opacity: 0.3
          },
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 6
        }],
        title: {
          text: `${monthName}月五行业碳排放分析`,
          left: 'center',
          bottom:0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        grid: {
          top: '80px',
          left: '50px',
          right: '50px',
          bottom: '80px'
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
      const success = await getRadarData();
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
.radar-component {
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