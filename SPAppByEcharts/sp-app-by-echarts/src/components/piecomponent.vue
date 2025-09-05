<template>
  <div id="pie">
      <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import {inject, onMounted, reactive, ref, nextTick,onUnmounted} from 'vue';
import {customized} from '../assets/customized.js'; // 引入自定义主题
import eventBus from '@/main';

export default {
  name:'piecomponent',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const chartContainer = ref(null);
    
    //定义响应式数据
    let PieData = reactive({}); //存储所有月份的数据
    let currentmonthData = ref([]); //存储当前月份的数据
    let currentMonth = ref('January'); //存储当前月份
    //监听月份变化的事件总线
    eventBus.on('monthChanged', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value); //处理数据
      initChart(); //重新初始化图表
    });

    //获取后端数据(所有月份)
    async function getPieData(){
      try {
        const response = await $axios.get('/pie/data');
        Object.assign(PieData, response.data.PieData);
        disposeData(currentMonth.value); // 默认显示一月数据
        return true;
      } catch (error) {
        console.error('获取扇形图数据失败:', error);
        return false;
      }
    }
    
    //处理数据(当前月份)
    function disposeData(currentMonth){
      if (PieData[currentMonth + 'Data']) {  //MapData[currentMonth + 'Data'] 取对象属性值
        currentmonthData.value = PieData[currentMonth + 'Data'];
      }
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value) return;
      
      const myChart = $echarts.init(chartContainer.value,customized);
      const option = {
        title: {
          text: '河南省当月农业用水量占比图',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#01ffff',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '用水占比',
            type: 'pie',
            radius: '50%',
            data: currentmonthData.value,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              color: '#fff',
              fontSize: 12
            }
          }
        ],
        backgroundColor: 'rgba(16, 31, 53, 0.7)',
        borderRadius: 16,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(66, 139, 202, 0.2)',
        borderWidth: 1
      };
      
      myChart.setOption(option);
      
      // 监听窗口调整大小
      window.addEventListener('resize', function() {
        myChart.resize();
      });
      
      return myChart;
    }

    onMounted(async () => {
      // 先获取数据
      const success = await getPieData();
      if (success) {
        // 使用 nextTick 确保 DOM 渲染完成
        nextTick(() => {
          initChart();
        });
      }
    });

    onUnmounted(() => {
    // 移除事件监听器
    eventBus.off('monthChanged');
    // window.removeEventListener('resize', resizeHandler);
    });
    
    return {
      PieData,
      currentmonthData,
      getPieData,
      processData: disposeData,
      chartContainer
    }
  },
}
</script>

<style scoped>
#pie {
  flex: 1;
  background: rgba(16, 31, 53, 0.6);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(66, 139, 202, 0.2);
}
.chart-container {
  width: 100%;
  height: 420px;
}
/* 响应式设计 */
@media (max-width: 768px) {
  #pie {
    height: 300px;
  }
}
@media (max-height: 1347px) {
  #pie {
    min-width: 500px;
  }
}

</style>