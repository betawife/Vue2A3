<template>
  <section id="map">
      <div ref="chartContainer" style="width: 100%; height:860px"></div>
  </section>
</template>

<script>
import Mapdatav from '../assets/Mapdata.geojson';
import {inject, onMounted, reactive, ref, nextTick,onUnmounted} from 'vue';
import eventBus from '@/main';

export default {
  name:'Map',
  setup(){
    const $echarts = inject('echarts');
    const $axios = inject('axios');
    const chartContainer = ref(null);
    
    //定义响应式数据
    let MapData = reactive({}); //存储所有月份的数据
    let currentmonthData = ref([]); //存储当前月份的数据
    let currentMonth = ref('January'); //存储当前月份
    //监听月份变化的事件总线
    eventBus.on('monthChanged', (newMonth) => {
      currentMonth.value = newMonth;
      disposeData(currentMonth.value); //处理数据
      initChart(); //重新初始化图表
    });

    // 获取城市坐标的函数
    function getCityCoordinates(cityName) {
      const cityCoordinates = {
        '郑州市': { lng: 113.665412, lat: 34.757975 },
        '开封市': { lng: 114.341447, lat: 34.797049 },
        '洛阳市': { lng: 112.434468, lat: 34.663041 },
        '平顶山市': { lng: 113.307718, lat: 33.735241 },
        '安阳市': { lng: 114.352482, lat: 36.103442 },
        '鹤壁市': { lng: 114.295444, lat: 35.748236 },
        '新乡市': { lng: 113.883991, lat: 35.302616 },
        '焦作市': { lng: 113.238266, lat: 35.23904 },
        '濮阳市': { lng: 115.041299, lat: 35.768234 },
        '许昌市': { lng: 113.826063, lat: 34.022956 },
        '漯河市': { lng: 114.026405, lat: 33.575855 },
        '三门峡市': { lng: 111.194099, lat: 34.777338 },
        '南阳市': { lng: 112.540918, lat: 32.999082 },
        '商丘市': { lng: 115.650497, lat: 34.437054 },
        '信阳市': { lng: 114.075031, lat: 32.123274 },
        '周口市': { lng: 114.649653, lat: 33.620357 },
        '驻马店市': { lng: 114.024736, lat: 32.980169 },
        '济源市': { lng: 112.590047, lat: 35.090378 }
      };
      
      return cityCoordinates[cityName] || { lng: 113.665412, lat: 34.757975 };
    }
    
    //获取后端数据(所有月份)
    async function getMapData(){
      try {
        const response = await $axios.get('/map/data');
        Object.assign(MapData, response.data.MapData);
        disposeData(currentMonth.value); // 默认显示一月数据
        return true;
      } catch (error) {
        console.error('获取地图数据失败:', error);
        return false;
      }
    }
    
    //处理数据(当前月份)
    function disposeData(currentMonth){
      if (MapData[currentMonth + 'Data']) {  //MapData[currentMonth + 'Data'] 取对象属性值
        currentmonthData.value = MapData[currentMonth + 'Data'];
      }
    }

    // 初始化图表
    function initChart() {
      if (!chartContainer.value) return;
      
      const myChart = $echarts.init(chartContainer.value);
      $echarts.registerMap('Map', Mapdatav); //注册地图Map
      
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        geo: {  // 地图图表，作为背景坐标系
          type: 'map',
          map: 'Map', //使用注册的地图
          roam: false,
          emphasis: {
            label: {
              show: false
            }
          },
          itemStyle: {
            borderColor: '#404a59',
            areaColor: '#323c48'
          },
          
        },

        title: {
          text: '河南省当月农业用水量分布图',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontSize: 24
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}<br/>用水量: ${params.value[2]}万吨`;
          },
          textStyle: {
            fontSize: 14
          }
        },
        visualMap: {
          type: 'continuous',
          min: 1,
          max: 20,
          calculable: true,
          inRange: {
            color: ['#e0ffff', '#006edd']
          },
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },

        series: [   // 散点图，显示各城市的用水量
          {
            name: '农业用水量',
            type: 'scatter',
            coordinateSystem: 'geo', // 使用刚设置的地理坐标系
            symbolSize: function (val) {
              return Math.max(8, val[2] / 80);
            },
            itemStyle: {
              color: function(params) {
                const value = params.data.value[2];
                const ratio = value  / (20 - 1);
                return $echarts.color.modifyHSL('#006edd', 0, 0, -ratio * 0.5);
              }
            },
            emphasis: {
              itemStyle: {
                color: '#ff7f50',
                shadowBlur: 10,
                shadowColor: 'rgba(255, 127, 80, 0.5)'
              }
            },

            data: currentmonthData.value.map(item => {
              const coordinates = getCityCoordinates(item.name);
              return {
                name: item.name,
                value: [coordinates.lng, coordinates.lat, item.value] //value数组的三个元素,[经度, 纬度, 用水量]
              };
            }),
            label: {
              show: true,
              position: 'bottom',
              formatter:'{b}: {@[2]}万吨', // 使用 {@[2]} 获取value数组的第三个元素
              color: '#01ffff',
              fontSize: 12,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: [2, 4],
              borderRadius: 3
            }
          }
        ]
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
      const success = await getMapData();
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
      MapData,
      currentmonthData,
      getMapData,
      processData: disposeData,
      chartContainer
    }
  },
}
</script>

<style scoped>
#map {
  flex: 1;
  background: rgba(16, 31, 53, 0.7);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(66, 139, 202, 0.2);
}

.chart-container {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media (max-height: 1347px) {
  #map {
    min-height: 1100px;
  }
  
  .chart-container {
    min-height: 1100px;
  }
}

@media (max-width: 768px) {
  #map {
    min-height: 500px;
    border-radius: 10px;
  }
  
  .chart-container {
    min-height: 500px;
  }
}
</style>