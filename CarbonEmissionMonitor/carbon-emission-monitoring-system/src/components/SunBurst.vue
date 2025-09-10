<template>
  <div class="sunburst-component">
    <div class="component-header">
      <h3>碳排放旭日图</h3>
      <p>碳排来源分布 - 三地区组成</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted,watch} from 'vue';

export default {
  name:'SunBurst',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus =inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    //定义响应式数据
    let SunburstData = reactive({});
    let currentmonthData = ref([]);
    let currentMonth = ref('01');
    // 注入主题对象
    const theme = inject('theme'); // 响应式主题名称 ('green' 或 'lowCarbon')
    const greenEcologyTheme = inject('greenEcologyTheme'); 
    const lowCarbonTheme = inject('lowCarbonTheme'); 

    //监听月份变化的事件总线
    eventBus.on('monthChanged', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value);
      initChart();
    });

    //获取后端数据(所有月份)
    async function getSunBurstData(){
      try {
        const response = await $axios.get('/sunburst/data');
        // console.log('API响应数据:', response.data);
        Object.assign(SunburstData, response.data.SunBurstData);
        disposeData(currentMonth.value);
        return true;
      } catch (error) {
        console.error('获取旭日图数据失败:', error);
        }
    }
    
    // 处理数据(当前月份)
    function disposeData(currentMonth){
      const monthKey = '2024-' + currentMonth;
      if (SunburstData[monthKey]) {
        currentmonthData.value = SunburstData[monthKey];
      } else {
        console.warn(`未找到 ${monthKey} 的数据`);
        currentmonthData.value = { name: monthKey, children: [] };
      }
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value || !currentmonthData.value.children) return;
      
      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);
      
      const option = {
        backgroundColor: 'transparent',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '3%',
          containLabel: true
        },
        title: {
          text: `2024-${currentMonth.value}月三地区碳排放组成`,
          left: 'center',
          bottom:0,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}<br/>碳排放量: ${params.value.toFixed(2)} 万吨CO₂`;
          }
        },
        series: [{
          type: 'sunburst',
          data: [currentmonthData.value],
          radius: ['15%', '90%'],
          label: {
            show: true,
            formatter: '{b}'
          },
          emphasis: {
            focus: 'ancestor'
          },
          levels: [
            {},
            {
              r0: '15%',
              r: '35%',
              itemStyle: {
                borderWidth: 2
              },
              label: {
                position:'inside',
                rotate: 'tangential',
                fontSize: 12
              }
            },
            {
              r0: '35%',
              r: '70%',
              label: {
                align: 'right',
                fontSize: 11
              }
            },
            {
              r0: '70%',
              r: '90%',
              label: {
                position: 'outside',
                padding: 3,
                silent: false,
                fontSize: 10
              },
              itemStyle: {
                borderWidth: 1
              }
            }
          ]
        }]
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
      const success = await getSunBurstData();
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
.sunburst-component {
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

.chart-container {
  flex: 1;
  min-height: 400px;
  width: 100%;
}
</style>