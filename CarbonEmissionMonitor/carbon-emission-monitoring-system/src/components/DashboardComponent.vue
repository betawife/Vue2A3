<template>
  <div class="dashboard-container">
    <!-- 输入区域 - 左上 -->
    <div class="input-section">
      <div class="section-header">
        <h3>输入您的今日碳排活动</h3>
        <p>记录您的日常活动，计算碳足迹</p>
      </div>
      
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
      <button class="calculate-btn" @click="calculateCarbon">
        <i class="icon-calculate"></i>
        计算碳排量
      </button>
    </div>
    
    <!-- 仪表盘区域 - 右上 -->
    <div class="gauge-section">
      <div class="section-header">
        <h3>碳排量仪表盘</h3>
        <p>实时监测您的碳排放情况</p>
      </div>
      
      <div ref="chartContainer" class="gauge-container"></div>
      
      <div v-if="DashboardData.value > 0" class="result-display">
        <h3>您的今日碳排量: {{ DashboardData.value.toFixed(2) }} kg</h3>
        <p class="result-message" :class="getEmissionLevel(DashboardData.value)">
          {{ getEmissionMessage(DashboardData.value) }}
        </p>
      </div>
    </div>
    
    <!-- 减碳生活Tips - 底部 -->
    <div class="tips-section">
      <div class="section-header">
        <h3>减碳生活小贴士</h3>
        <p>了解更多减少碳排放的方法</p>
      </div>
      
      <div class="tips-grid">
        <div 
          v-for="(tip, index) in carbonTips" 
          :key="index" 
          class="tip-card"
          @click="showTipDetail(tip)"
        >
          <div class="tip-icon">
            <i :class="tip.icon"></i>
          </div>
          <h4>{{ tip.title }}</h4>
          <p>{{ tip.summary }}</p>
          <span class="read-more">阅读更多 →</span>
        </div>
      </div>
    </div>
    
    <!-- 文章详情弹窗 -->
    <div v-if="selectedTip" class="modal-overlay" @click="selectedTip = null">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="selectedTip = null">
          <i class="icon-close"></i>
        </button>
        <h2>{{ selectedTip.title }}</h2>
        <div class="modal-body">
          <p v-html="selectedTip.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, inject, ref, reactive, nextTick } from 'vue';

export default {
  name: 'DashBoard',
  setup() {
    const $echarts = inject('echarts');
    const chartContainer = ref(null);
    let DashboardData = reactive({ value: 0 });
    let myChart = ref(null);
    
    const transportInput = reactive({
      privateCar: 0,
      publicTransport: 0,
      walkingBiking: 0
    });
    
    const applianceUsage = ref(0);
    const waterHeaterUsage = ref(0);
    const selectedTip = ref(null);
    
    const carbonTips = [
      {
        title: "绿色出行方式",
        icon: "icon-transport",
        summary: "选择公共交通或骑行，大幅减少碳排放",
        content: "选择公共交通、骑行或步行代替私家车出行，每减少1公里私家车行驶，可减少约0.14kg碳排放。城市规划良好的地区，公共交通可减少70%的交通相关碳排放。"
      },
      {
        title: "节能家电使用",
        icon: "icon-appliance",
        summary: "高效能家电节省能源又减碳",
        content: "选择能源效率高的家电产品，如节能认证的空调、冰箱等。使用时注意合理设置温度，空调温度夏季设定在26℃以上，冬季设定在20℃以下，每年可减少数百公斤碳排放。"
      },
      {
        title: "减少食物浪费",
        icon: "icon-food",
        summary: "合理规划饮食，减少碳足迹",
        content: "食物生产过程中会产生大量碳排放，减少食物浪费可直接降低碳排放。合理规划采购和餐饮，妥善保存食物，剩余食材创意利用，每年可为一个家庭减少数百公斤碳排放。"
      },
      {
        title: "绿色购物选择",
        icon: "icon-shopping",
        summary: "环保产品选择与减少包装",
        content: "选择本地生产、季节性产品减少运输碳排放；选择简易包装或环保包装产品；使用可重复使用的购物袋；支持环保认证产品。这些选择可显著减少产品生命周期的碳排放。"
      }
    ];

    function calculateCarbon() {
      const privateCarEmission = transportInput.privateCar * 0.14;
      const publicTransportEmission = transportInput.publicTransport * 0.06;
      const walkingBikingEmission = transportInput.walkingBiking * 0.01;
      
      const applianceEmission = applianceUsage.value * 0.6;
      const waterHeaterEmission = (waterHeaterUsage.value / 0.5) * 6;
      
      DashboardData.value = privateCarEmission + publicTransportEmission + 
                           walkingBikingEmission + applianceEmission + 
                           waterHeaterEmission;
      
       // 添加日期时间戳
      const today = new Date().toISOString().split('T')[0];
      const dataToStore = {
        date: today,
        value: DashboardData.value
      };
      localStorage.setItem('todayCarbonEmission', JSON.stringify(dataToStore));                     
      updateChart();
      
    }
    
    function getEmissionLevel(value) {
      if (value < 10) return 'low';
      if (value < 35) return 'medium';
      return 'high';
    }
    
    function getEmissionMessage(value) {
      if (value < 15) return '优秀！您的碳排放在较低水平';
      if (value < 30) return '良好！仍有改进空间';
      return '注意！您的碳排放较高，建议采取减碳措施';
    }
    
    function showTipDetail(tip) {
      selectedTip.value = tip;
    }
    
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

    function initChart() {
      if (!chartContainer.value) return;
      
      myChart.value = $echarts.init(chartContainer.value);
      updateChart();
      
      window.addEventListener('resize', function() {
        myChart.value.resize();
      });
      
      return myChart.value;
    }

    onMounted(() => {
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
      carbonTips,
      selectedTip,
      calculateCarbon,
      getEmissionLevel,
      getEmissionMessage,
      showTipDetail
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 24px;
}

.input-section {
  grid-column: 1;
  grid-row: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.gauge-section {
  grid-column: 2;
  grid-row: 1;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.tips-section {
  grid-column: 1 / span 2;
  grid-row: 2;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #1f2d3d;
  font-size: 18px;
}

.section-header p {
  margin: 0;
  color: #7a8a9a;
  font-size: 14px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.option-item input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.option-item input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.calculate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #42b983 0%, #3498db 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.gauge-container {
  flex: 1;
  min-height: 300px;
}

.result-display {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.result-display h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.result-message {
  margin: 0;
  font-weight: 500;
}

.result-message.low {
  color: #27ae60;
}

.result-message.medium {
  color: #f39c12;
}

.result-message.high {
  color: #e74c3c;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tip-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.tip-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #42b983 0%, #3498db 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: white;
  font-size: 20px;
}

.tip-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.tip-card p {
  margin: 0 0 15px 0;
  color: #7a8a9a;
  font-size: 14px;
  line-height: 1.5;
}

.read-more {
  color: #42b983;
  font-weight: 600;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #7a8a9a;
}

.modal-content h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  padding-right: 30px;
}

.modal-body {
  line-height: 1.6;
  color: #34495e;
}

/* 图标样式 */
.icon-calculate:before { content: "📊"; }
.icon-transport:before { content: "🚌"; }
.icon-appliance:before { content: "🔌"; }
.icon-food:before { content: "🍎"; }
.icon-shopping:before { content: "🛍️"; }
.icon-close:before { content: "✕"; }

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .input-section {
    grid-column: 1;
    grid-row: 1;
  }
  
  .gauge-section {
    grid-column: 1;
    grid-row: 2;
  }
  
  .tips-section {
    grid-column: 1;
    grid-row: 3;
  }
}

@media (max-width: 576px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-container {
    padding: 10px;
    gap: 16px;
  }
  
  .input-section,
  .gauge-section,
  .tips-section {
    padding: 16px;
  }
}
</style>