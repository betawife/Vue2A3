<template>
  <div class="chart-container">
    <!-- 添加碳排量选项 -->
    <div class="carbon-options">
      <h3>输入您的今日碳排活动</h3>
      <div class="option-list">
        <!-- 私家车出行 -->
        <div class="option-item">
          <label>私家车出行里程 (km):</label>
          <input 
            type="number" 
            v-model="transportInput.privateCar" 
            min="0" 
            step="0.1"
            placeholder="请输入公里数"
          >
        </div>
        
        <!-- 公共交通出行 -->
        <div class="option-item">
          <label>公共交通出行里程 (km):</label>
          <input 
            type="number" 
            v-model="transportInput.publicTransport" 
            min="0" 
            step="0.1"
            placeholder="请输入公里数"
          >
        </div>
        
        <!-- 步行/自行车出行 -->
        <div class="option-item">
          <label>步行/自行车出行里程 (km):</label>
          <input 
            type="number" 
            v-model="transportInput.walkingBiking" 
            min="0" 
            step="0.1"
            placeholder="请输入公里数"
          >
        </div>
        
        <!-- 电器使用 -->
        <div class="option-item">
          <label>电器使用时长 (小时):</label>
          <input 
            type="number" 
            v-model="applianceUsage" 
            min="0" 
            step="0.1"
            placeholder="请输入小时数"
          >
        </div>
        
        <!-- 热水器使用 -->
        <div class="option-item">
          <label>热水器使用时长 (0.5小时为单位):</label>
          <input 
            type="number" 
            v-model="waterHeaterUsage" 
            min="0" 
            step="0.5"
            placeholder="请输入0.5小时的倍数"
          >
        </div>
      </div>
      <button @click="calculateCarbon">计算碳排量</button>
    </div>
    
    <!-- 结果显示 -->
    <div v-if="DashboardData.value > 0" class="result-display">
      <h3>您的今日碳排量: {{ DashboardData.value.toFixed(2) }} kg</h3>
    </div>
    
    <!-- 图表容器 -->
    <div ref="chartContainer" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import { onMounted, inject, ref, reactive, nextTick } from 'vue';
import eventBus from '@/main';

export default {
  name: 'DashBoard',
  setup() {
    const $echarts = inject('echarts');
    // 设置响应式数据
    const chartContainer = ref(null);
    let DashboardData = reactive({ value: 0 }); // 存储数据，初始值为0
    let myChart = ref(null); // 存储图表实例
    
    // 碳排量输入
    const transportInput = reactive({
      privateCar: 0,
      publicTransport: 0,
      walkingBiking: 0
    });
    
    const applianceUsage = ref(0);
    const waterHeaterUsage = ref(0);

    // 计算碳排量
    function calculateCarbon() {
      // 计算交通碳排量
      const privateCarEmission = transportInput.privateCar * 0.14;
      const publicTransportEmission = transportInput.publicTransport * 0.06;
      const walkingBikingEmission = transportInput.walkingBiking * 0.01;
      
      // 计算电器碳排量
      const applianceEmission = applianceUsage.value * 0.6;
      
      // 计算热水器碳排量 (每0.5小时产生6kg)
      const waterHeaterEmission = (waterHeaterUsage.value / 0.5) * 6;
      
      // 总碳排量
      DashboardData.value = privateCarEmission + publicTransportEmission + 
                           walkingBikingEmission + applianceEmission + 
                           waterHeaterEmission;
      
      updateChart();
      
      // 使用mitt事件总线发送碳排量数据
      eventBus.emit('carbonCalculated', DashboardData.value);
    }
    
    // 更新图表
    function updateChart() {
    if (!myChart.value) return;
  
    const option = {
    title: {
      text: '我的当日碳排量',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      formatter: '{a} <br/>{b} : {c}kg'
    },
    series: [   
      {
        name: '当日碳排量',
        type: 'gauge',
        min: 0,
        max: 50,
        radius: '80%', // 控制环形大小
        startAngle: 220, // 起始角度（180度为左侧水平）
        endAngle: -40, // 结束角度（0度为右侧水平）
        progress: {
          show: true,
          width: 30,
          roundCap: true, // 圆角端点
          itemStyle: {
            color: 'skyblue' 
          }
        },
        axisLine: {
          roundCap: true, // 圆角端点
          lineStyle: {
            width: 30,
            color: [
              [0.3, '#7CFFB2'], // 0-30% 绿色
              [0.7, '#FDDD60'], // 30-70% 黄色
              [1, '#FF6E76'] // 70-100% 红色
            ]
          }
        },
        axisTick: {
          show: false // 隐藏刻度线
        },
        splitLine: {
          show: false // 隐藏分割线
        },
        axisLabel: {
          show: false // 隐藏刻度标签
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 10,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto' // 指针颜色与进度条一致
          }
        },
        anchor: {
          show: true,
          size: 20,
          showAbove: true,
          itemStyle: {
            borderWidth: 8,
            borderColor: '#fff',
            color: 'auto' 
          }
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}kg',
          fontSize: 20,
          color: '#fff', 
          offsetCenter: [0, '0%'] // 将数值显示在环中心
        },
        data: [{
          value: DashboardData.value,
          name: '碳排量'
        }]
      }
    ]
  };
  
  myChart.value.setOption(option);
}

    // 初始化图表
    function initChart() {
      if (!chartContainer.value) {
        console.error('图表容器未找到');
        return;
      }
      
      myChart.value = $echarts.init(chartContainer.value);
      updateChart();
      
      // 监听窗口调整大小
      window.addEventListener('resize', function() {
        myChart.value.resize();
      });
      
      return myChart.value;
    }

    onMounted(() => {
      // 使用 nextTick 确保 DOM 渲染完成
      nextTick(() => {
        initChart();
      });
    });
    
    return {
      chartContainer,
      DashboardData,
      transportInput,
      applianceUsage,
      waterHeaterUsage,
      calculateCarbon
    }
  }
};
</script>

<style scoped>
.carbon-options {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 15px 0;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-item label {
  font-weight: bold;
  margin-bottom: 5px;
}

.option-item input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
}

button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.result-display {
  margin: 20px 0;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.result-display h3 {
  margin: 0;
  color: #2e7d32;
}
</style>