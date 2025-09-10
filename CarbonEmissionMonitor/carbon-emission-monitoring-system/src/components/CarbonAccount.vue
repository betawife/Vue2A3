<template>
  <div class="carbon-account">
    <h2>我的碳账户</h2>
    <p>个人碳足迹管理 - 近60天记录</p>
    
    <!-- 日历热力图 -->
    <div class="calendar-heatmap">
      <div class="heatmap-header">
        <h3>碳排放日历</h3>
        <div class="color-scale">
          <span>低</span>
          <div class="color-gradient"></div>
          <span>高</span>
        </div>
      </div>
      <div ref="heatmapContainer" class="heatmap-chart"></div>
    </div>
    
    <!-- 统计数据 -->
    <div class="stats-section" v-if="stats">
      <div class="stat-card">
        <h4>近7天平均</h4>
        <p class="stat-value">{{ stats.last7DaysAvg.toFixed(2) }} kg</p>
      </div>
      <div class="stat-card">
        <h4>近30天平均</h4>
        <p class="stat-value">{{ stats.last30DaysAvg.toFixed(2) }} kg</p>
      </div>
      <div class="stat-card">
        <h4>总记录天数</h4>
        <p class="stat-value">{{ stats.totalDays }} 天</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, inject, computed } from 'vue';

export default {
  name: 'CarbonAccount',
  setup() {
    const $echarts = inject('echarts');
    const heatmapContainer = ref(null);
    const heatmapData = ref([]);
    const myChart = ref(null);
    
    // 生成最近60天的日期
    const generateLast60Days = () => {
      const days = [];
      const today = new Date();
      for (let i = 59; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
      }
      return days;
    };
    
    // 获取日期范围
    const getDateRange = () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 59);
      
      return [
        startDate.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      ];
    };
    
    // 从本地存储加载数据
    const loadHeatmapData = () => {
      const last60Days = generateLast60Days();
      const storedData = localStorage.getItem('carbonCalendarData');
      let calendarData = [];
      
      if (storedData) {
        try {
          calendarData = JSON.parse(storedData);
        } catch (e) {
          console.error('解析日历数据失败:', e);
        }
      }
      
      // 合并数据，确保有最近60天的记录
      heatmapData.value = last60Days.map(date => {
        const existingRecord = calendarData.find(d => d.date === date);
        return {
          date,
          value: existingRecord ? existingRecord.value : 0
        };
      });
    };
    
    // 检查并添加今日数据
    const checkAndAddTodayData = () => {
      const today = new Date().toISOString().split('T')[0];
      const todayDataStr = localStorage.getItem('todayCarbonEmission');
      
      if (todayDataStr) {
        try {
          const todayData = JSON.parse(todayDataStr);
          
          // 检查时间戳是否是今天的
          if (todayData.date === today) {
            // 更新热力图数据中的今日记录
            const todayIndex = heatmapData.value.findIndex(d => d.date === today);
            if (todayIndex !== -1) {
              heatmapData.value[todayIndex].value = todayData.value;
            } else {
              heatmapData.value.push({
                date: today,
                value: todayData.value
              });
            }
            
            // 保存更新后的日历数据
            saveCalendarData();
          }
        } catch (e) {
          console.error('解析今日数据失败:', e);
        }
      }
    };
    
    // 保存日历数据到本地存储
    const saveCalendarData = () => {
      // 只保存有值的记录
      const dataToSave = heatmapData.value.filter(item => item.value > 0);
      localStorage.setItem('carbonCalendarData', JSON.stringify(dataToSave));
    };
    
    // 计算统计数据
    const stats = computed(() => {
      if (heatmapData.value.length === 0) return null;
      
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const last7DaysData = heatmapData.value.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && item.value > 0;
      });
      
      const last30DaysData = heatmapData.value.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= thirtyDaysAgo && item.value > 0;
      });
      
      const totalDays = heatmapData.value.filter(item => item.value > 0).length;
      
      const last7DaysAvg = last7DaysData.length > 0 
        ? last7DaysData.reduce((sum, item) => sum + item.value, 0) / last7DaysData.length
        : 0;
        
      const last30DaysAvg = last30DaysData.length > 0 
        ? last30DaysData.reduce((sum, item) => sum + item.value, 0) / last30DaysData.length
        : 0;
      
      return {
        last7DaysAvg,
        last30DaysAvg,
        totalDays
      };
    });
    
    // 初始化热力图
    const initHeatmap = () => {
      if (!heatmapContainer.value) return;
      
      myChart.value = $echarts.init(heatmapContainer.value);
      
      const dateRange = getDateRange();
      
      const option = {
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return `${params.data[0]}: ${params.data[1]} kg`;
          }
        },
        visualMap: {
          show:false,
          min: 0,
          max: 50,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 10,
          inRange: {
            color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
          }
        },
        calendar: {
          top: 30,
          left: 30,
          right: 30,
          cellSize: ['auto', 15],
          range: dateRange, // 修复：使用具体的日期范围数组
          itemStyle: {
            borderWidth: 1,
            borderColor: '#ddd'
          },
          yearLabel: { show: false },
          dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
          },
          monthLabel: {
            show: true,
            nameMap: 'cn'
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: heatmapData.value.map(item => [item.date, item.value])
        }
      };
      
      myChart.value.setOption(option);
      
      window.addEventListener('resize', function() {
        if (myChart.value) {
          myChart.value.resize();
        }
      });
    };
    
    onMounted(() => {
      loadHeatmapData();
      checkAndAddTodayData();
      initHeatmap();
    });
    
    return {
      heatmapContainer,
      stats
    };
  }
};
</script>

<style scoped>
.carbon-account {
  padding: 20px;
  height: 100%;
}

.calendar-heatmap {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.color-scale {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-gradient {
  width: 100px;
  height: 20px;
  background: linear-gradient(90deg, #c6e48b, #7bc96f, #239a3b, #196127);
  border-radius: 4px;
}

.heatmap-chart {
  height: 300px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card h4 {
  margin: 0 0 10px 0;
  color: #7a8a9a;
  font-size: 14px;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #42b983;
}

@media (max-width: 768px) {
  .heatmap-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>