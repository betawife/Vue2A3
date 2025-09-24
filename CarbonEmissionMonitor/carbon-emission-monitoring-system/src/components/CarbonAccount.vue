<template>
  <div class="carbon-account">
    <div class="login-prompt" v-if="!isLoggedIn">
      <div class="prompt-content">
        <h3>请先登录</h3>
        <p>登录后查看您的碳账户数据</p>
        <button class="login-btn" @click="emitOpenLogin">立即登录</button>
      </div>
    </div>
    
    <div v-else>
      <h2>我的碳账户</h2>
      <p>个人碳足迹管理 - 近60天记录</p>
      
      <!-- 排名信息 -->
      <div class="rank-section" v-if="hasData">
        <div class="rank-header">
          <h3>环保达人排行榜</h3>
          <div class="current-rank" v-if="currentUserRank">
            <span>我的排名: 第 {{ currentUserRank.rank }} 名</span>
          </div>
        </div>
        
        <div class="rank-list">
          <div class="rank-item" 
               v-for="user in displayedRanks" 
               :key="user.rank"
               :class="{ 'current-user': user.name === userData.name, 'top-three': user.rank <= 3 }">
            <div class="rank-number" :class="getRankClass(user.rank)">
              {{ user.rank }}
            </div>
            <div class="user-avatar">
              <img :src="user.avatar" :alt="user.name" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-emission">碳排放: {{ user.totalEmission }} kg</div>
            </div>
            <div class="rank-badge" v-if="user.rank <= 3">
              <span>{{ getRankBadge(user.rank) }}</span>
            </div>
          </div>
        </div>
        
        <div class="rank-pagination" v-if="rankList.length > pageSize">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
      
      <!-- 日历热力图 -->
      <div class="calendar-heatmap" v-if="hasData">
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
      <div class="stats-section" v-if="hasData && stats">
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
        <div class="stat-card">
          <h4>近30日总排放</h4>
          <p class="stat-value">{{ stats.last30DaysTotal.toFixed(2) }} kg</p>
        </div>
      </div>
      
      <!-- 无数据提示 -->
      <div class="no-data" v-if="isLoggedIn && !hasData">
        <div class="no-data-content">
          <h3>暂无数据</h3>
          <p>您还没有碳排放记录，开始记录您的碳足迹吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, inject, computed, watch } from 'vue';

export default {
  name: 'CarbonAccount',
  setup(props, { emit }) {
    const $echarts = inject('echarts');
    const eventBus = inject('eventBus');
    const heatmapContainer = ref(null);
    const myChart = ref(null);
    
    // 登录状态
    const isLoggedIn = ref(false);
    
    // 用户数据
    const userData = ref({
      name: '',
      carbonRank: null,
      carbonCalendar: []
    });
    
    // 排名列表数据
    const rankList = ref([]);
    
    // 分页相关
    const currentPage = ref(1);
    const pageSize = ref(10);
    
    // 检查是否有数据
    const hasData = computed(() => {
      return isLoggedIn.value && 
             userData.value.name && 
             (userData.value.carbonCalendar.length > 0 || rankList.value.length > 0);
    });
    
    // 从localStorage加载数据
    const loadData = () => {
      // 检查登录状态
      const storedLoginState = localStorage.getItem('loginState');
      if (storedLoginState) {
        try {
          const loginState = JSON.parse(storedLoginState);
          isLoggedIn.value = loginState.isLoggedIn;
        } catch (e) {
          console.error('解析登录状态失败:', e);
          isLoggedIn.value = false;
        }
      }
      
      // 只有在登录状态下才加载数据
      if (isLoggedIn.value) {
        const storedUser = localStorage.getItem('currentUser');
        const storedRankList = localStorage.getItem('rankList');
        
        if (storedUser) {
          try {
            userData.value = JSON.parse(storedUser);
          } catch (e) {
            console.error('解析用户数据失败:', e);
          }
        }
        
        if (storedRankList) {
          try {
            rankList.value = JSON.parse(storedRankList);
          } catch (e) {
            console.error('解析排名列表失败:', e);
          }
        }
      } else {
        // 未登录状态，清空数据
        userData.value = { name: '', carbonRank: null, carbonCalendar: [] };
        rankList.value = [];
      }
    };
    
    // 触发打开登录弹窗
    const emitOpenLogin = () => {
      if (eventBus) {
        eventBus.emit('openLogin');
      }
    };
    
    // 计算当前用户的排名信息
    const currentUserRank = computed(() => {
      return rankList.value.find(user => user.name === userData.value.name);
    });
    
    // 计算显示的分页排名
    const displayedRanks = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      return rankList.value.slice(startIndex, endIndex);
    });
    
    // 计算总页数
    const totalPages = computed(() => {
      return Math.ceil(rankList.value.length / pageSize.value);
    });
    
    // 分页控制
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    
    // 排名样式类
    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-gold';
      if (rank === 2) return 'rank-silver';
      if (rank === 3) return 'rank-bronze';
      return '';
    };
    
    // 排名徽章
    const getRankBadge = (rank) => {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return '';
    };
    
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
    
    // 合并日历数据
    const mergeCalendarData = () => {
      if (!userData.value.carbonCalendar || userData.value.carbonCalendar.length === 0) {
        return [];
      }
      
      const last60Days = generateLast60Days();
      
      return last60Days.map(date => {
        const existingRecord = userData.value.carbonCalendar.find(d => d.date === date);
        return {
          date,
          value: existingRecord ? existingRecord.value : 0
        };
      });
    };
    
    // 检查并添加今日数据
    const checkAndAddTodayData = () => {
      // 只有在登录状态下才处理今日数据
      if (!isLoggedIn.value) return;
      
      const today = new Date().toISOString().split('T')[0];
      const todayDataStr = localStorage.getItem('todayCarbonEmission');
      
      if (todayDataStr) {
        try {
          const todayData = JSON.parse(todayDataStr);
          
          if (todayData.date === today && todayData.value > 0) {
            // 更新用户数据中的今日记录
            const todayIndex = userData.value.carbonCalendar.findIndex(d => d.date === today);
            if (todayIndex !== -1) {
              userData.value.carbonCalendar[todayIndex].value = todayData.value;
            } else {
              userData.value.carbonCalendar.push({
                date: today,
                value: todayData.value
              });
            }
            
            // 更新排名列表
            updateRankList();
            
            // 保存数据到本地存储
            saveDataToLocalStorage();
            
            // 发送碳数据更新事件到UserComponent
            sendCarbonDataUpdate();
          }
        } catch (e) {
          console.error('解析今日数据失败:', e);
        }
      }
    };
    
    // 更新排名列表
    const updateRankList = () => {
      // 只有在登录状态下才更新排名
      if (!isLoggedIn.value) return;
      
      // 计算近30日总排放量（用于排名）
      const last30DaysTotal = calculateLast30DaysTotal();
      
      // 更新当前用户在排名列表中的数据
      const userIndex = rankList.value.findIndex(user => user.name === userData.value.name);
      if (userIndex !== -1) {
        rankList.value[userIndex].totalEmission = last30DaysTotal;
      } else {
        // 如果用户不在排名列表中，添加新条目
        rankList.value.push({
          rank: rankList.value.length + 1,
          name: userData.value.name,
          totalEmission: last30DaysTotal,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.value.name}`
        });
      }
      
      // 重新排序排名列表（碳排放量越低排名越靠前）
      rankList.value.sort((a, b) => a.totalEmission - b.totalEmission);
      
      // 更新排名数字
      rankList.value.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      // 更新用户的排名
      const currentUser = rankList.value.find(user => user.name === userData.value.name);
      if (currentUser) {
        userData.value.carbonRank = currentUser.rank;
      }
    };
    
    // 计算近30日总排放量
    const calculateLast30DaysTotal = () => {
      const calendarData = mergeCalendarData();
      if (calendarData.length === 0) return 0;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      return calendarData
        .filter(item => new Date(item.date) >= thirtyDaysAgo)
        .reduce((sum, item) => sum + item.value, 0);
    };
    
    // 保存数据到本地存储
    const saveDataToLocalStorage = () => {
      // 只有在登录状态下才保存数据
      if (isLoggedIn.value) {
        localStorage.setItem('currentUser', JSON.stringify(userData.value));
        localStorage.setItem('rankList', JSON.stringify(rankList.value));
      }
    };
    
    // 发送碳数据更新事件到UserComponent
    const sendCarbonDataUpdate = () => {
      if (eventBus && isLoggedIn.value) {
        eventBus.emit('carbonDataUpdated', {
          carbonRank: userData.value.carbonRank,
          carbonCalendar: userData.value.carbonCalendar,
          rankList: rankList.value
        });
      }
    };
    
    // 计算统计数据
    const stats = computed(() => {
      const calendarData = mergeCalendarData();
      if (calendarData.length === 0) return null;
      
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const last7DaysData = calendarData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sevenDaysAgo && item.value > 0;
      });
      
      const last30DaysData = calendarData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= thirtyDaysAgo && item.value > 0;
      });
      
      const totalDays = calendarData.filter(item => item.value > 0).length;
      const totalEmission = calendarData.reduce((sum, item) => sum + item.value, 0);
      const last30DaysTotal = calculateLast30DaysTotal();
      
      const last7DaysAvg = last7DaysData.length > 0 
        ? last7DaysData.reduce((sum, item) => sum + item.value, 0) / last7DaysData.length
        : 0;
        
      const last30DaysAvg = last30DaysData.length > 0 
        ? last30DaysData.reduce((sum, item) => sum + item.value, 0) / last30DaysData.length
        : 0;
      
      return {
        last7DaysAvg,
        last30DaysAvg,
        totalDays,
        totalEmission,
        last30DaysTotal
      };
    });
    
    // 初始化热力图
    const initHeatmap = () => {
      if (!heatmapContainer.value || !$echarts || !hasData.value) return;
      
      myChart.value = $echarts.init(heatmapContainer.value);
      
      const dateRange = getDateRange();
      const calendarData = mergeCalendarData();
      
      const option = {
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return `${params.data[0]}: ${params.data[1]} kg`;
          }
        },
        visualMap: {
          show: false,
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
          range: dateRange,
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
          data: calendarData.map(item => [item.date, item.value])
        }
      };
      
      myChart.value.setOption(option);
      
      // 响应式调整
      window.addEventListener('resize', () => {
        if (myChart.value) {
          myChart.value.resize();
        }
      });
    };
    
    // 监听UserComponent发送的用户数据更新
    if (eventBus) {
      eventBus.on('userDataUpdated', (data) => {
        isLoggedIn.value = data.isLoggedIn || false;
        userData.value = data.userData || { name: '', carbonRank: null, carbonCalendar: [] };
        rankList.value = data.rankList || [];
        
        // 重新初始化热力图
        if (myChart.value) {
          initHeatmap();
        }
      });
    }
    
    onMounted(() => {
      loadData();
      checkAndAddTodayData();
      initHeatmap();
    });
    
    // 监听userData变化，更新热力图和排名
    watch(userData, () => {
      if (myChart.value) {
        initHeatmap();
      }
    }, { deep: true });
    
    // 监听登录状态变化
    watch(isLoggedIn, (newVal) => {
      if (!newVal) {
        // 未登录状态，清空数据
        userData.value = { name: '', carbonRank: null, carbonCalendar: [] };
        rankList.value = [];
        
        // 销毁图表
        if (myChart.value) {
          myChart.value.dispose();
          myChart.value = null;
        }
      } else {
        // 登录状态，重新加载数据
        loadData();
        initHeatmap();
      }
    });
    
    return {
      heatmapContainer,
      userData,
      rankList,
      currentPage,
      pageSize,
      isLoggedIn,
      hasData,
      currentUserRank,
      displayedRanks,
      totalPages,
      stats,
      nextPage,
      prevPage,
      getRankClass,
      getRankBadge,
      emitOpenLogin
    };
  }
};
</script>

<style scoped>
.carbon-account {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.login-prompt {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 40px 0;
}

.prompt-content h3 {
  color: #666;
  margin-bottom: 10px;
}

.prompt-content p {
  color: #999;
  margin-bottom: 20px;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.rank-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-rank {
  background: #f0f9ff;
  padding: 8px 16px;
  border-radius: 20px;
  color: #0369a1;
  font-weight: 600;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.rank-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rank-item.current-user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.rank-item.top-three {
  background: linear-gradient(135deg, #fff3cd 0%, #f8d7da 100%);
}

.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
  background: #e9ecef;
  color: #495057;
}

.rank-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
}

.rank-silver {
  background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
  color: #000;
}

.rank-bronze {
  background: linear-gradient(135deg, #cd7f32 0%, #e9b384 100%);
  color: #fff;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 16px;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.user-emission {
  color: #666;
  font-size: 14px;
}

.rank-item.current-user .user-emission {
  color: rgba(255, 255, 255, 0.8);
}

.rank-badge {
  font-size: 20px;
}

.rank-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.rank-pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.rank-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.calendar-heatmap {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  gap: 8px;
}

.color-gradient {
  width: 100px;
  height: 20px;
  background: linear-gradient(to right, #ebedf0, #c6e48b, #7bc96f, #239a3b, #196127);
  border-radius: 4px;
}

.heatmap-chart {
  height: 200px;
  width: 100%;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h4 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.stat-value {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 40px 0;
}

.no-data-content h3 {
  color: #666;
  margin-bottom: 10px;
}

.no-data-content p {
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carbon-account {
    padding: 10px;
  }
  
  .rank-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .heatmap-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>