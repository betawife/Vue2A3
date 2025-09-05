<template>
  <div id="barcomponent">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import eventBus from '@/main';
import { inject, reactive, ref, onMounted, nextTick } from 'vue';

export default {
  name: 'barcomponent',

  setup() {
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    // 设置响应式数据
    const chartContainer = ref(null);
    let BarData = reactive({}); // 存储数据
    let currentMonth = ref('January'); // 存储当前月份
    let myChart = ref(null); // 存储图表实例

    // 获取后端数据
    async function getBarData() {
      try {
        const response = await $axios.get('/bar/data');
        Object.assign(BarData, response.data.BarData); // response.data.BarData,后端返回的数据对象；Object.assign将其可枚举的属性添加到BarData上
        return true;
      } catch (error) {
        console.error('获取柱形图数据失败:', error);
        return false;
      }
    }

    // 初始化图表
    function initChart() {
        if (!chartContainer.value) {
      console.error('bar图表容器未找到');
      return;
    }
      
      myChart.value = $echarts.init(chartContainer.value);
      
      const option = {
        title: {
          text: '河南省历月农业用水量分布图',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: '#01ffff',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>用水量: ${params[0].value}万吨`; //params 是一个数组，包含当前所有系列的数据，params[0] 代表第一个系列的数据
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          axisLabel: {
            color: '#01ffff',
            interval: 0,
            rotate: 45,
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#404a59'
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        xAxis: {
          type: "value",
          name: '用水量(万吨)',
          nameTextStyle: {
            color: '#01ffff'
          },
          axisLabel: {
            color: '#01ffff'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#404a59'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(64, 74, 89, 0.3)',
              type: 'dashed'
            }
          }
        },
        series: [   // 柱形图，显示各月份的总用水量
          {
            name: '河南省历月农业用水量',
            type: 'bar',
            barWidth: '60%',
            // 更改点击事件触发范围
            triggerEvent: true, // 开启组件触发事件
            silent: false,      // 允许图形触发事件
            
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#4facfe' },
                  { offset: 1, color: '#00f2fe' }
                ]
              },
              borderRadius: [0, 5, 5, 0],
              shadowBlur: 10,
              shadowColor: 'rgba(0, 242, 254, 0.5)'
            },
            emphasis: {
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#ff9a9e' },
                    { offset: 1, color: '#fad0c4' }
                  ]
                },
                shadowBlur: 15,
                shadowColor: 'rgba(255, 154, 158, 0.7)'
              }
            },
            data: BarData.data, 
            label: {
              show: true,
              position: 'right',
              color: '#fff',
              fontSize: 12,
              formatter: '{c}万吨'
            }
          }
        ]
      };
      
      myChart.value.setOption(option);
      
      // echarts图表点击事件，更新currentMonth
      myChart.value.on("click", function(params) {
        currentMonth.value = params.name;
        eventBus.emit('monthChanged', currentMonth.value); // 通过事件总线发送月份变化
      });
      
      // 监听窗口调整大小
      window.addEventListener('resize', function() {
        myChart.value.resize();
      });
      
      return myChart.value;
    }

    onMounted(async () => {
      // 先获取数据
      const success = await getBarData();
      if (success) {
        // 使用 nextTick 确保 DOM 渲染完成
        nextTick(() => {
          initChart();
        });
      }
    });
    
    return {
      BarData,
      currentMonth,
      getBarData,
      chartContainer,
      initChart
    }
  }
}
</script>

<style scoped>
#barcomponent {
  width: 100%;
  height: 420px;
  position: relative;
  /* background: linear-gradient(135deg, #1a2a6c, #2a4b8c); */
  background-color: rgba(16, 31, 53, 0.7);
  border-radius: .75rem;
  box-shadow: 0 .375rem 1rem rgba(0, 0, 0, 0.3);
  overflow: hidden;
  padding: 0.5rem;
  box-sizing: border-box;
}

#barcomponent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: .0625rem;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 242, 254, 0.5), 
    transparent);
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: unset;
}

/* 响应式设计 */
@media screen and (max-width: 48rem) {
  #barcomponent {
    padding: .5rem;
    border-radius: .5rem;
    height: 420px;
  }
  
  .chart-container {
    min-height: unset;
  }
}

/* 动画效果 */
#barcomponent {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>