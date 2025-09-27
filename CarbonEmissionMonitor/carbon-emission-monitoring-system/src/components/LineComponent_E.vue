<template>
  <div class="stacked-line-component">
    <div class="component-header">
      <h3>能耗历史趋势</h3>
      <p>2024年长三角地区能耗趋势</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted, watch} from 'vue';

export default {
  name:'StackedLineComponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    // 定义响应式数据
    let StackedLineData = reactive({});
    let currentMonth = ref('01');
    
    // 注入主题对象
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme');
    const lowCarbonTheme = inject('lowCarbonTheme');
    
    // 获取后端数据(所有月份)
    async function getStackedLineData(){
      try {
        const response = await $axios.get('/line_E/data');
        if (response.data.LineData) {
          Object.assign(StackedLineData, response.data.LineData);
          return true;
        }
      } catch (error) {
        console.error('获取堆叠折线图数据失败:', error);
        return false;
      }
    }
    
    // 初始化图表
    function initChart() {
      if (!chartContainer.value)   return;

      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);
      
      // 准备数据
      const months = StackedLineData.months || [];
      const jiangsuData = StackedLineData.jiangsu || [];
      const shanghaiData = StackedLineData.shanghai || [];
      const zhejiangData = StackedLineData.zhejiang || [];
      
      let option = {
        title: {
          text: '2024年 长三角地区能耗趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let result = `${params[0].axisValue}月<br/>`;
            let total = 0;
            
            params.forEach(item => {
              const actualValue = item.value;
              result += `${item.marker} ${item.seriesName}: ${actualValue}<br/>`;
              total += actualValue;
            });
            
            result += `<b>总计: ${total}</b>`;
            return result;
          }
        },
        legend: {
          data: ['江苏省', '上海市', '浙江省'],
          top: 30,
          right: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: 80,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: months
        },
        yAxis: {
          type: 'value',
          name: '能耗(万吨)'
        },
        series: [
          {
            name: '江苏省',
            type: 'line',
            data: jiangsuData,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '上海市',
            type: 'line',
            data: shanghaiData,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '浙江省',
            type: 'line',
            data: zhejiangData,
            emphasis: {
              focus: 'series'
            }
          }
        ]
      };
      
      myChart.setOption(option);
      chartLoaded.value = true;
      
      // 图表点击事件,触发事件总线传递月份
      myChart.on('click', (params) => {
        // 检查是否点击了数据点或坐标轴标签
        if (params.componentType === 'xAxis' || 
            (params.componentType === 'series' && params.value !== undefined)) {
          
          let targetMonth;
          if (params.componentType === 'xAxis') {
            // 点击坐标轴标签
            targetMonth = params.value;
          } else {
            // 点击数据点
            targetMonth = months[params.dataIndex];
          }
          
          if (targetMonth && typeof targetMonth === 'string') {
            currentMonth.value = targetMonth;
            eventBus.emit('monthChanged_E', currentMonth.value);
          }
        }
      });

      // 监听主题变化
      watch(theme, () => {
        if (myChart) {
          myChart.dispose();
          chartLoaded.value = false;
          initChart();
        }
      });
      
      // 监听窗口调整大小
      const resizeHandler = function() {
        if (myChart) {
          myChart.resize();
        }
      };
      window.addEventListener('resize', resizeHandler);
      
      // 返回清理函数
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }
      
    onMounted(async () => {
      const success = await getStackedLineData();
      if (success) {
        await nextTick();
        initChart();
      }
    });
    
    onUnmounted(() => {
      eventBus.off('monthChanged_E');
    });
    
    return {
      chartContainer,
      chartLoaded
    }
  },
}
</script>

<style scoped>
.stacked-line-component {
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

.chart-container {
  flex: 1;
  min-height: 400px;
  width: 100%;
}
</style>