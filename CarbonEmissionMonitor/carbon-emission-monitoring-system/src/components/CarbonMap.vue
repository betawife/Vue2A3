<template>
  <section id="map">
    <div class="map-header">
      <h2>长三角碳排放监测</h2>
      <p>实时碳排放数据可视化（数据来源：carbonmonitor.org.cn）</p>
    </div>
    <div ref="chartContainer" class="chart-container"></div>
  </section>
</template>

<script>
import Mapdatav from '../assets/mapdatav.geojson';
import {inject, onMounted, reactive, ref, nextTick, onUnmounted,watch} from 'vue';

export default {
  name:'CarbonMap',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const eventBus =inject('eventBus');
    const chartContainer = ref(null);
    
    //定义响应式数据
    let ScatterData = reactive({});
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
    async function getMapData(){
      try {
        const response = await $axios.get('/map/data');
        Object.assign(ScatterData, response.data.ScatterData);
        disposeData(currentMonth.value);
        return true;
      } catch (error) {
        console.error('获取地图数据失败:', error);
        // 若失败，使用模拟数据
        const mockData = {
          "2024-01": [
            { "name": "江苏省", "value": [119.4783, 32.4886, 67.110101] },
            { "name": "上海市", "value": [121.4737, 31.2304, 10.804960] },
            { "name": "浙江省", "value": [120.1551, 30.2741, 30.164235] }
          ]
        };
        Object.assign(ScatterData, mockData);
        disposeData(currentMonth.value);
        return true;
      }
    }
    
    //处理数据(当前月份)
    function disposeData(currentMonth){
      if (ScatterData['2024-'+currentMonth]) {
        currentmonthData.value = ScatterData['2024-'+currentMonth];
      }
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value) return;
      const currentThemeConfig = theme.value === 'green' ? greenEcologyTheme : lowCarbonTheme;
      const myChart = $echarts.init(chartContainer.value,currentThemeConfig);
      $echarts.registerMap('Map', Mapdatav);
      
      // 减碳主题配色 - 绿色系
      const carbonColors = ['#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#4caf50', '#388e3c', '#2e7d32'];
      
      const option = {
        backgroundColor: 'transparent',
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true
        },
        title: {
          text: `2024年${currentMonth.value}月碳排放分布`,
          left: 'center',
          top: 0,
          textStyle: {
            color: '#2e7d32',
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        geo: {
          type: 'map',
          map: 'Map',
          roam: true,
          zoom: 1.2,
          emphasis: {
            itemStyle: {
              areaColor: '#ffd54f',
              borderColor: '#388e3c'
            },
            label: {
              show: true,
              color: '#1b5e20',
              fontSize: 12,
              fontWeight: 'bold'
            }
          },
          itemStyle: {
            borderColor: '#81c784',
            borderWidth: 1,
            areaColor: '#e8f5e9'
          },
          label: {
            show: true,
            color: '#388e3c',
            fontSize: 11
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#4caf50',
          borderWidth: 1,
          textStyle: {
            color: '#1b5e20',
            fontSize: 14
          },
          formatter: function(params) {
            if (params.componentType === 'series') {
              return `<div style="font-weight:bold;color:#2e7d32;margin-bottom:5px;">${params.name}</div>
                      <div>碳排放量: <span style="color:#e65100;font-weight:bold">${params.value[2].toFixed(2)} 万吨CO₂</span></div>`;
            }
            return params.name;
          }
        },
        visualMap: {
          type: 'continuous',
          min: 1,
          max: 80,
          calculable: true,
          inRange: {
            color: carbonColors
          },
          textStyle: {
            color: '#1b5e20',
            fontSize: 12
          },
          left: 'right',
          bottom: 'bottom',
          orient: 'vertical',
          formatter: function (value) {
            return value.toFixed(0) + ' 万吨';
          }
        },
        series: [
          {
            name: '碳排放量',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: function (val) {
              return Math.max(10, Math.min(30, val[2] / 3));
            },
            itemStyle: {
              color: function(params) {
                const value = params.data.value[2];
                if (value < 15) return '#4caf50';
                if (value < 30) return '#8bc34a';
                if (value < 45) return '#cddc39';
                if (value < 60) return '#ffc107';
                return '#ff9800';
              },
              shadowBlur: 8,
              shadowColor: 'rgba(0, 150, 136, 0.3)'
            },
            emphasis: {
              itemStyle: {
                color: '#ff5722',
                shadowBlur: 12,
                shadowColor: 'rgba(255, 87, 34, 0.5)'
              }
            },
            data: currentmonthData.value,
            label: {
              show: true,
              position: 'bottom',
              formatter: '{b}\n{@[2]}万吨',
              color: '#1b5e20',
              fontSize: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: [3, 5],
              borderRadius: 3,
              borderColor: '#81c784',
              borderWidth: 1,
              fontWeight: 'bold'
            }
          }
        ]
      };
      
      myChart.setOption(option);
      
      // 监听窗口调整大小
      const resizeHandler = function() {
        myChart.resize();
      };
      window.addEventListener('resize', resizeHandler);
      // 监听主题变化
      watch(theme, () => {
        // 主题变化时重新初始化图表
        if (myChart) {
          myChart.dispose();
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
      const success = await getMapData();
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
      chartContainer
    }
  },
}
</script>

<style scoped>
#map {
  flex: 1;
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  border: 1px solid #c8e6c9;
  height: 600px; /* 减小地图高度 */
}

.map-header {
  padding: 16px 20px 8px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #e8f5e9;
}

.map-header h2 {
  color: #2e7d32;
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.map-header p {
  color: #689f38;
  margin: 0;
  font-size: 13px;
}

.chart-container {
  width: 100%;
  height: calc(100% - 70px);
  padding: 10px;
}

/* 响应式设计 */
@media (max-height: 1347px) {
  #map {
    min-height: 500px;
    height: 500px;
  }
}

@media (max-width: 768px) {
  #map {
    min-height: 400px;
    height: 400px;
    border-radius: 8px;
  }
  
  .chart-container {
    height: calc(100% - 60px);
  }
}
</style>