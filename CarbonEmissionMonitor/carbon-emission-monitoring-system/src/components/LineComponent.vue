<template>
  <div class="line-component" ref="chartContainer">
    <div class="component-header">
      <h3>碳排放趋势图</h3>
      <p>2024历史碳排变化趋势</p>
    </div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick, onUnmounted, watch} from 'vue';

export default {
  name:'LineComponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus = inject('eventBus');
    const chartContainer = ref(null);
    const chartLoaded = ref(false);
    
    // 定义响应式数据
    let LineData = reactive({});
    let currentMonth = ref('01');
    
    // 注入主题对象
    const theme = inject('theme');
    const greenEcologyTheme = inject('greenEcologyTheme');
    const lowCarbonTheme = inject('lowCarbonTheme');
    
    // 获取后端数据(所有月份)
    async function getLineData(){
      try {
        const response = await $axios.get('/line/data');
        if (response.data.LineData) {
          Object.assign(LineData, response.data.LineData);
          return true;
        }
      } catch (error) {
        console.error('获取折线图数据失败:', error);
        return false;
      }
    }
    
    // 初始化图表
    function initChart() {
      if (!chartContainer.value)   return;

      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value, currentThemeConfig);
      
      let option = {
        title: {
          text: '2024年长三角地区碳排趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['江苏省', '上海市', '浙江省']
        },
        xAxis: {
          type: 'category',
          data: LineData.months
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '江苏省',
            type: 'line',
            data: LineData.江苏省
          },
          {
            name: '上海市',
            type: 'line',
            data: LineData.上海市
          },
          {
            name: '浙江省',
            type: 'line',
            data: LineData.浙江省
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
            targetMonth = LineData.months[params.dataIndex];
          }
          
          if (targetMonth && typeof targetMonth === 'string' && targetMonth.includes('-')) {
            currentMonth.value = targetMonth.split('-')[1];
            eventBus.emit('monthChanged', currentMonth.value);
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
      const success = await getLineData();
      if (success) {
        await nextTick();
        initChart();
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
.line-component {
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
</style>