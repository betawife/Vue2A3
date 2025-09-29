<template>
  <div class="dashboard-container">
    <!-- 输入区域 - 左上 -->
    <div class="input-section">
      <div class="section-header">
        <h3>输入您的今日碳排活动</h3>
        <p>记录您的日常活动，计算碳足迹</p>
      </div>
      
      <!-- 出行方式选择 -->
      <div class="transport-section">
        <h4>出行方式</h4>
        <div class="transport-tabs">
          <button 
            v-for="transport in transportTypes" 
            :key="transport.type"
            :class="['tab-btn', { active: selectedTransport === transport.type }]"
            @click="selectTransport(transport.type)"
            type="button"
          >
            <i :class="transport.icon"></i>
            {{ transport.name }}
          </button>
        </div>
        
        <!-- 路线规划输入 -->
        <div class="route-input">
          <div class="input-group">
            <label for="route-origin">起点：</label>
            <input 
              id="route-origin"
              type="text" 
              v-model="routeInput.origin" 
              placeholder="例如：北京市朝阳区"
              @keyup.enter="calculateRoute"
              name="route-origin"
            >
          </div>
          <div class="input-group">
            <label for="route-destination">终点：</label>
            <input 
              id="route-destination"
              type="text" 
              v-model="routeInput.destination" 
              placeholder="例如：北京市海淀区"
              @keyup.enter="calculateRoute"
              name="route-destination"
            >
          </div>
          <button class="route-btn" @click="calculateRoute" :disabled="isCalculatingRoute" type="button">
            <i class="icon-route"></i>
            {{ isCalculatingRoute ? '计算中...' : '计算路线' }}
          </button>
        </div>
        
        <!-- 路线结果 -->
        <div v-if="routeResult.distance > 0" class="route-result">
          <p><strong>路线距离:</strong> {{ (routeResult.distance / 1000).toFixed(2) }} km</p>
          <p><strong>预计时间:</strong> {{ Math.floor(routeResult.duration / 60) }} 分钟</p>
          <p><strong>碳排放:</strong> {{ (routeResult.distance / 1000 * getCurrentEmissionFactor()).toFixed(2) }} kg</p>
          <button class="add-route-btn" @click="addRouteToCalculation" type="button">
            添加到碳排计算
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="routeError" class="error-message">
          {{ routeError }}
        </div>
      </div>
      
      <div class="option-list">
        <!-- 电器使用 -->
        <div class="option-item">
          <label for="appliance-usage">电器使用时长 (小时):</label>
          <input 
            id="appliance-usage"
            type="number" 
            v-model="applianceUsage" 
            min="0" 
            step="0.1"
            placeholder="请输入小时数"
            name="appliance-usage"
          >
        </div>
        
        <!-- 热水器使用 -->
        <div class="option-item">
          <label for="water-heater-usage">热水器使用时长 (0.5小时为单位):</label>
          <input 
            id="water-heater-usage"
            type="number" 
            v-model="waterHeaterUsage" 
            min="0" 
            step="0.5"
            placeholder="请输入0.5小时的倍数"
            name="water-heater-usage"
          >
        </div>
        
        <!-- 手动输入出行距离 -->
        <div class="option-item">
          <label for="manual-transport-input">手动输入出行距离 (km):</label>
          <div class="manual-input-group">
            <input 
              id="manual-transport-input"
              type="number" 
              v-model="manualTransportInput" 
              min="0" 
              step="0.1"
              placeholder="请输入公里数"
              name="manual-transport-input"
            >
            <select v-model="manualTransportType" id="manual-transport-type" name="manual-transport-type">
              <option value="privateCar">私家车</option>
              <option value="publicTransport">公共交通</option>
              <option value="walkingBiking">步行/自行车</option>
            </select>
            <button class="add-manual-btn" @click="addManualTransport" type="button">
              添加
            </button>
          </div>
        </div>
        
        <!-- 已添加的出行记录 -->
        <div v-if="transportRecords.length > 0" class="transport-records">
          <h4>已添加的出行记录</h4>
          <div 
            v-for="(record, index) in transportRecords" 
            :key="index" 
            class="record-item"
          >
            <span>{{ getTransportName(record.type) }}: {{ record.distance.toFixed(2) }} km ({{ (record.distance * record.emissionFactor).toFixed(2) }} kg)</span>
            <button class="remove-btn" @click="removeTransportRecord(index)" type="button">×</button>
          </div>
        </div>
      </div>
      
      <button class="calculate-btn" @click="calculateCarbon" type="button">
        <i class="icon-calculate"></i>
        计算总碳排量
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
        
        <!-- 碳排放明细 -->
        <div v-if="transportRecords.length > 0" class="emission-breakdown">
          <h4>碳排放明细:</h4>
          <div class="breakdown-item">
            <span>出行碳排放:</span>
            <span>{{ transportEmission.reduce((sum, emission) => sum + emission, 0).toFixed(2) }} kg</span>
          </div>
          <div class="breakdown-item">
            <span>电器使用:</span>
            <span>{{ applianceEmission.toFixed(2) }} kg</span>
          </div>
          <div class="breakdown-item">
            <span>热水器使用:</span>
            <span>{{ waterHeaterEmission.toFixed(2) }} kg</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 地图展示区域 - 底部左侧 -->
    <div class="map-section">
      <div class="section-header">
        <h3>出行路线展示</h3>
        <p>查看您的出行路线规划</p>
        <!-- <div class="map-controls">
          <button @click="clearMap" class="clear-map-btn" type="button">清除路线</button>
        </div> -->
      </div>
      <div ref="mapContainer" class="map-container"></div>
      <div v-if="!isMapLoaded" class="map-loading">
        <p>地图加载中...</p>
      </div>
    </div>
    
    <!-- 减碳生活Tips - 底部右侧 -->
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
          role="button"
          tabindex="0"
          @keyup.enter="showTipDetail(tip)"
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
        <button class="modal-close" @click="selectedTip = null" type="button" aria-label="关闭弹窗">
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
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  name: 'DashBoard',
  setup() {
    const $echarts = inject('echarts');
    const chartContainer = ref(null);
    const mapContainer = ref(null);
    let DashboardData = reactive({ value: 0 });
    let myChart = ref(null);
    let map = ref(null);
    
    // 状态变量
    const isMapLoaded = ref(false);
    const isCalculatingRoute = ref(false);
    const routeError = ref('');
    
    // 碳排放计算变量
    const transportEmission = ref([]);
    const applianceEmission = ref(0);
    const waterHeaterEmission = ref(0);
    
    // 高德API配置 
    const amapConfig = {
      key: 'bab7baccafd8d9b9cf5ab01b3a566417',
      version: '2.0',
      securityJsCode: 'b21944cd8dd59b95011bddc2a876858a' 
    };
    
    // 出行方式
    const transportTypes = [
      { 
        type: 'privateCar', 
        name: '私家车', 
        icon: 'icon-car', 
        emissionFactor: 0.14,
        routeType: 'driving'
      },
      { 
        type: 'publicTransport', 
        name: '公共交通', 
        icon: 'icon-bus', 
        emissionFactor: 0.06,
        routeType: 'bus'
      },
      { 
        type: 'walkingBiking', 
        name: '步行/自行车', 
        icon: 'icon-bike', 
        emissionFactor: 0.01,
        routeType: 'walking'
      }
    ];
    
    const selectedTransport = ref('privateCar');
    const routeInput = reactive({
      origin: '',
      destination: ''
    });
    
    const routeResult = reactive({
      distance: 0,
      duration: 0,
      path: []
    });
    
    const transportRecords = ref([]);
    
    const applianceUsage = ref(0);
    const waterHeaterUsage = ref(0);
    const selectedTip = ref(null);
    
    const manualTransportInput = ref(0);
    const manualTransportType = ref('privateCar');
    
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

    // 获取当前出行方式的排放系数
    function getCurrentEmissionFactor() {
      const transport = transportTypes.find(t => t.type === selectedTransport.value);
      return transport ? transport.emissionFactor : 0;
    }

    // 初始化地图 
    function initMap() {
      if (!mapContainer.value) {
        console.error('地图容器未找到');
        return;
      }
      
      // 设置安全配置
      window._AMapSecurityConfig = {
        securityJsCode: amapConfig.securityJsCode
      };
      
      // 使用AMapLoader加载地图 
      AMapLoader.load({
        key: amapConfig.key,
        version: amapConfig.version,
        plugins: ['AMap.Driving', 'AMap.Transfer', 'AMap.Walking', 'AMap.Scale'] // 添加需要的插件
      }).then((AMap) => {
        try {
          map.value = new AMap.Map(mapContainer.value, {
            zoom: 12,
            center: [116.397428, 39.90923], // 默认北京中心
            viewMode: '2D',
            mapStyle: 'amap://styles/normal'
          });
          
          // 添加比例尺控件
          const scale = new AMap.Scale();
          map.value.addControl(scale);
          
          isMapLoaded.value = true;
          console.log('高德地图初始化成功');
        } catch (error) {
          console.error('地图初始化失败:', error);
          routeError.value = '地图初始化失败: ' + error.message;
          isMapLoaded.value = false;
        }
      }).catch((error) => {
        console.error('高德地图JS API加载失败:', error);
        routeError.value = '地图加载失败，请检查网络连接和密钥配置';
        isMapLoaded.value = false;
      });
    }
    
    // 选择出行方式
    function selectTransport(type) {
      selectedTransport.value = type;
      routeError.value = ''; // 清除错误信息
    }
    
    // 获取出行方式名称
    function getTransportName(type) {
      const transport = transportTypes.find(t => t.type === type);
      return transport ? transport.name : '';
    }
    
    // 计算路线
    function calculateRoute() {
      if (!routeInput.origin || !routeInput.destination) {
        routeError.value = '请输入起点和终点';
        return;
      }
      
      if (!isMapLoaded.value || !map.value) {
        routeError.value = '地图尚未加载完成，请稍后重试';
        return;
      }
      
      isCalculatingRoute.value = true;
      routeError.value = '';
      
      // 清除地图上已有的路线
      clearMap();
      
      const selectedTransportType = transportTypes.find(t => t.type === selectedTransport.value);
      
      try {
        // 根据出行方式选择不同的路线规划服务
        switch (selectedTransportType.routeType) {
          case 'driving':
            calculateDrivingRoute();
            break;
          case 'bus':
            calculateBusRoute();
            break;
          case 'walking':
            calculateWalkingRoute();
            break;
          default:
            routeError.value = '不支持的出行方式';
            isCalculatingRoute.value = false;
        }
      } catch (error) {
        console.error('路线规划错误:', error);
        routeError.value = '路线规划失败: ' + error.message;
        isCalculatingRoute.value = false;
      }
    }
    
    // 计算驾车路线
    function calculateDrivingRoute() {
      const driving = new AMap.Driving({
        map: map.value,
        policy: AMap.DrivingPolicy.LEAST_TIME
      });
      
      driving.search([
        { keyword: routeInput.origin },
        { keyword: routeInput.destination }
      ], (status, result) => {
        isCalculatingRoute.value = false;
        
        if (status === 'complete') {
          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            routeResult.distance = route.distance;
            routeResult.duration = route.time;
            
            // 添加起点和终点标记
            if (result.start && result.destination) {
              addMarkers(result.start, result.destination, '驾车路线');
            }
            
            console.log('驾车路线规划成功，距离:', route.distance, '米');
          } else {
            routeError.value = '未找到可行的驾车路线';
          }
        } else {
          routeError.value = '驾车路线规划失败: ' + (result.info || '未知错误');
          console.error('驾车路线规划失败:', result);
        }
      });
    }
    
    // 计算公交路线
    function calculateBusRoute() {
      const transfer = new AMap.Transfer({
        map: map.value,
        city: '全国',
        policy: AMap.TransferPolicy.LEAST_TIME
      });
      
      transfer.search([
        { keyword: routeInput.origin },
        { keyword: routeInput.destination }
      ], (status, result) => {
        isCalculatingRoute.value = false;
        
        if (status === 'complete') {
          if (result.plans && result.plans.length > 0) {
            const plan = result.plans[0];
            routeResult.distance = plan.distance;
            routeResult.duration = plan.time;
            
            // 添加起点和终点标记
            if (result.start && result.destination) {
              addMarkers(result.start, result.destination, '公交路线');
            }
            
            console.log('公交路线规划成功，距离:', plan.distance, '米');
          } else {
            routeError.value = '未找到可行的公交路线';
          }
        } else {
          routeError.value = '公交路线规划失败: ' + (result.info || '未知错误');
          console.error('公交路线规划失败:', result);
        }
      });
    }
    
    // 计算步行路线
    function calculateWalkingRoute() {
      const walking = new AMap.Walking({
        map: map.value
      });
      
      walking.search([
        { keyword: routeInput.origin },
        { keyword: routeInput.destination }
      ], (status, result) => {
        isCalculatingRoute.value = false;
        
        if (status === 'complete') {
          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            routeResult.distance = route.distance;
            routeResult.duration = route.time;
            
            // 添加起点和终点标记
            if (result.start && result.destination) {
              addMarkers(result.start, result.destination, '步行路线');
            }
            
            console.log('步行路线规划成功，距离:', route.distance, '米');
          } else {
            routeError.value = '未找到可行的步行路线';
          }
        } else {
          routeError.value = '步行路线规划失败: ' + (result.info || '未知错误');
          console.error('步行路线规划失败:', result);
        }
      });
    }
    
    // 添加起点和终点标记
    function addMarkers(start, destination, routeType) {
      if (!map.value) return;
      
      // 清除现有标记
      map.value.clearMap();
      
      // 检查位置数据是否有效
      if (!start || !start.location || !destination || !destination.location) {
        console.warn('起点或终点位置数据无效');
        return;
      }
      
      // 起点标记
      new AMap.Marker({
        position: start.location,
        map: map.value,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
        offset: new AMap.Pixel(-13, -30)
      });
      
      // 终点标记
      new AMap.Marker({
        position: destination.location,
        map: map.value,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
        offset: new AMap.Pixel(-13, -30)
      });
      
      // 添加路线类型信息窗口
      const infoWindow = new AMap.InfoWindow({
        content: `<div class="route-info">
                  <h4>${routeType}</h4>
                  <p>起点: ${start.name || routeInput.origin}</p>
                  <p>终点: ${destination.name || routeInput.destination}</p>
                  <p>距离: ${(routeResult.distance / 1000).toFixed(2)} km</p>
                  <p>时间: ${Math.floor(routeResult.duration / 60)} 分钟</p>
                 </div>`,
        offset: new AMap.Pixel(0, -30)
      });
      
      // 在起点显示信息窗口
      infoWindow.open(map.value, start.location);
      
      // 调整地图视野以显示完整路线
      map.value.setFitView();
    }
    
    // 清除地图
    function clearMap() {
      if (map.value) {
        map.value.clearMap();
        routeResult.distance = 0;
        routeResult.duration = 0;
        routeError.value = '';
      }
    }
    
    // 添加路线到计算
    function addRouteToCalculation() {
      if (routeResult.distance === 0) {
        routeError.value = '请先计算路线';
        return;
      }
      
      const distanceInKm = routeResult.distance / 1000;
      const emissionFactor = getCurrentEmissionFactor();
      const emission = distanceInKm * emissionFactor;
      
      // 添加到出行记录
      transportRecords.value.push({
        type: selectedTransport.value,
        distance: distanceInKm,
        emissionFactor: emissionFactor
      });
      
      // 添加到排放数组
      transportEmission.value.push(emission);
      
      // 清空路线结果
      routeResult.distance = 0;
      routeResult.duration = 0;
      
      // 清除地图
      clearMap();
    }
    
    // 添加手动输入的出行记录
    function addManualTransport() {
      if (manualTransportInput.value <= 0) {
        routeError.value = '请输入有效的距离';
        return;
      }
      
      const emissionFactor = transportTypes.find(t => t.type === manualTransportType.value).emissionFactor;
      const emission = manualTransportInput.value * emissionFactor;
      
      // 添加到出行记录
      transportRecords.value.push({
        type: manualTransportType.value,
        distance: manualTransportInput.value,
        emissionFactor: emissionFactor
      });
      
      // 添加到排放数组
      transportEmission.value.push(emission);
      
      // 清空输入
      manualTransportInput.value = 0;
    }
    
    // 移除出行记录
    function removeTransportRecord(index) {
      transportRecords.value.splice(index, 1);
      transportEmission.value.splice(index, 1); // 同时删除对应的排放数据
    }
    
    // 计算碳排放
    function calculateCarbon() {
      // 计算出行碳排放
      const totalTransportEmission = transportEmission.value.reduce((sum, emission) => sum + emission, 0);
      
      // 计算电器使用碳排放
      applianceEmission.value = applianceUsage.value * 0.6;
      
      // 计算热水器使用碳排放
      waterHeaterEmission.value = (waterHeaterUsage.value / 0.5) * 6;
      
      // 总碳排放
      DashboardData.value = totalTransportEmission + applianceEmission.value + waterHeaterEmission.value;
      
      // 添加日期时间戳
      const today = new Date().toISOString().split('T')[0];
      const dataToStore = {
        date: today,
        value: DashboardData.value,
        records: transportRecords.value,
        transportEmissions: transportEmission.value, // 保存排放数组
        applianceUsage: applianceUsage.value,
        waterHeaterUsage: waterHeaterUsage.value
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
            radius: '80%',
            startAngle: 220,
            endAngle: -40,
            progress: {
              show: true,
              width: 30,
              roundCap: true,
              itemStyle: {
                color: 'skyblue' 
              }
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#7CFFB2'],
                  [0.7, '#FDDD60'],
                  [1, '#FF6E76']
                ]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 10,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
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
              offsetCenter: [0, '0%']
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
        initMap();
      });
    });
    
    return {
      chartContainer,
      mapContainer,
      DashboardData,
      transportTypes,
      selectedTransport,
      routeInput,
      routeResult,
      transportRecords,
      applianceUsage,
      waterHeaterUsage,
      carbonTips,
      selectedTip,
      manualTransportInput,
      manualTransportType,
      isMapLoaded,
      isCalculatingRoute,
      routeError,
      transportEmission,
      applianceEmission,
      waterHeaterEmission,
      selectTransport,
      calculateRoute,
      addRouteToCalculation,
      addManualTransport,
      removeTransportRecord,
      getTransportName,
      getCurrentEmissionFactor,
      calculateCarbon,
      getEmissionLevel,
      getEmissionMessage,
      showTipDetail,
      clearMap
    }
  }
};
</script>

<style scoped>
/* 样式保持不变，与原始代码相同 */
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

.map-section {
  grid-column: 1;
  grid-row: 2;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.tips-section {
  grid-column: 2;
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

.transport-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
}

.transport-section h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.transport-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #e8f5e9;
  border-color: #42b983;
  color: #42b983;
}

.tab-btn:hover {
  background: #e8f5e9;
}

.route-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-group label {
  min-width: 50px;
  font-weight: 600;
  color: #2c3e50;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.route-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.route-btn:hover {
  background: #2980b9;
}

.route-result {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.route-result p {
  margin: 4px 0;
  font-size: 14px;
}

.add-route-btn {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.add-route-btn:hover {
  background: #3aa876;
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

.option-item input,
.option-item select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.option-item input:focus,
.option-item select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.add-manual-btn {
  padding: 8px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.add-manual-btn:hover {
  background: #e67e22;
}

.transport-records {
  margin-top: 16px;
}

.transport-records h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 4px;
}

.record-item span {
  font-size: 14px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
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

.map-container {
  flex: 1;
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #7a8a9a;
}

.map-controls {
  margin-top: 8px;
}

.clear-map-btn {
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.clear-map-btn:hover {
  background: #c0392b;
}

.result-display {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.result-display h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  text-align: center;
}

.result-message {
  text-align: center;
  font-weight: 600;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.result-message.low {
  background: #e8f5e9;
  color: #2e7d32;
}

.result-message.medium {
  background: #fff3e0;
  color: #ef6c00;
}

.result-message.high {
  background: #ffebee;
  color: #c62828;
}

.emission-breakdown {
  margin-top: 16px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eaeaea;
  font-size: 14px;
}

.tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.tip-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.tip-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #42b983;
}

.tip-icon {
  width: 40px;
  height: 40px;
  background: #42b983;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: white;
}

.tip-card h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
}

.tip-card p {
  margin: 0 0 8px 0;
  color: #7a8a9a;
  font-size: 12px;
  line-height: 1.4;
}

.read-more {
  color: #3498db;
  font-size: 12px;
  font-weight: 600;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #7a8a9a;
}

.modal-content h2 {
  margin: 0 0 16px 0;
  color: #2c3e50;
}

.modal-body {
  line-height: 1.6;
  color: #5a6c7d;
}

.error-message {
  color: #e74c3c;
  background: #ffebee;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 14px;
}

.manual-input-group {
  display: flex;
  gap: 8px;
}

.manual-input-group input {
  flex: 2;
}

.manual-input-group select {
  flex: 1;
}

.manual-input-group button {
  flex: 0.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 16px;
  }
  
  .input-section,
  .gauge-section,
  .map-section,
  .tips-section {
    grid-column: 1;
  }
  
  .input-section { grid-row: 1; }
  .gauge-section { grid-row: 2; }
  .map-section { grid-row: 3; }
  .tips-section { grid-row: 4; }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .transport-tabs {
    flex-direction: column;
  }
  
  .manual-input-group {
    flex-direction: column;
  }
}
</style>